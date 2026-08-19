import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Order, OrderItem, OrderStatusHistory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PaymentsService } from '../payments/payments.service';
import { CouponsService } from '../coupons/coupons.service';
import { CaptchaService } from '../captcha/captcha.service';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderResponseDto } from './dto/order-response.dto';

const TAX_RATE = 0.08;
const DELIVERY_FEE_CENTS = 299;

type OrderWithRelations = Order & {
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
};

/**
 * Simulated real-time order progress: instead of a background job/cron
 * ticking every order forward, the next stage is computed lazily from
 * elapsed wall-clock time whenever an order is read, and persisted at
 * that point ("advance on read"). Gives testers a genuine "poll until
 * status changes" target without any scheduler infrastructure.
 */
const STAGE_SEQUENCE = [
  { status: 'PENDING', offsetSeconds: 0 },
  { status: 'CONFIRMED', offsetSeconds: 15 },
  { status: 'PREPARING', offsetSeconds: 35 },
  { status: 'OUT_FOR_DELIVERY', offsetSeconds: 60 },
  { status: 'DELIVERED', offsetSeconds: 90 },
] as const;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly paymentsService: PaymentsService,
    private readonly couponsService: CouponsService,
    private readonly captchaService: CaptchaService,
  ) {}

  private toResponseDto(order: OrderWithRelations): OrderResponseDto {
    return {
      id: order.id,
      status: order.status.toLowerCase() as OrderResponseDto['status'],
      paymentStatus:
        order.paymentStatus.toLowerCase() as OrderResponseDto['paymentStatus'],
      subtotalCents: order.subtotalCents,
      discountCents: order.discountCents,
      taxCents: order.taxCents,
      deliveryFeeCents: order.deliveryFeeCents,
      totalCents: order.totalCents,
      couponCode: order.couponCode,
      items: order.items.map((item) => ({
        productName: item.productName,
        size: item.sizeName,
        crust: item.crustName,
        toppings: item.toppingNames,
        unitPriceCents: item.unitPriceCents,
        quantity: item.quantity,
        lineTotalCents: item.lineTotalCents,
      })),
      statusHistory: order.statusHistory.map((h) => ({
        status: h.status.toLowerCase() as OrderResponseDto['status'],
        changedAt: h.changedAt.toISOString(),
      })),
      createdAt: order.createdAt.toISOString(),
      estimatedDeliveryAt: order.estimatedDeliveryAt?.toISOString() ?? null,
    };
  }

  private async applyAutoProgress(
    order: OrderWithRelations,
  ): Promise<OrderWithRelations> {
    if (order.status === 'CANCELLED' || order.status === 'DELIVERED') {
      return order;
    }

    const elapsedSeconds = (Date.now() - order.createdAt.getTime()) / 1000;
    const currentIndex = STAGE_SEQUENCE.findIndex(
      (s) => s.status === order.status,
    );
    let targetIndex = currentIndex;
    for (let i = currentIndex + 1; i < STAGE_SEQUENCE.length; i++) {
      if (elapsedSeconds >= STAGE_SEQUENCE[i].offsetSeconds) targetIndex = i;
      else break;
    }
    if (targetIndex === currentIndex) return order;

    const newHistoryEntries = STAGE_SEQUENCE.slice(
      currentIndex + 1,
      targetIndex + 1,
    ).map((stage) => ({
      status: stage.status,
      changedAt: new Date(
        order.createdAt.getTime() + stage.offsetSeconds * 1000,
      ),
    }));

    return this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: STAGE_SEQUENCE[targetIndex].status,
        statusHistory: { create: newHistoryEntries },
      },
      include: {
        items: true,
        statusHistory: { orderBy: { changedAt: 'asc' } },
      },
    });
  }

  async checkout(
    userId: string,
    cartId: string,
    dto: CheckoutDto,
  ): Promise<OrderResponseDto> {
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
    });
    if (!address) {
      throw new NotFoundException(`Address "${dto.addressId}" not found`);
    }

    const cart = await this.cartService.getCart(cartId);
    if (cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    if (!this.captchaService.verify(dto.captcha.token, dto.captcha.answer)) {
      throw new BadRequestException('Verification answer is incorrect');
    }

    const subtotalCents = cart.subtotalCents;

    if (dto.couponCode) {
      const preview = await this.couponsService.preview(
        dto.couponCode,
        subtotalCents,
      );
      if (!preview.valid) {
        throw new BadRequestException(preview.message);
      }
    }

    const chargeResult = this.paymentsService.charge(dto.card);
    if (!chargeResult.success) {
      throw new BadRequestException({
        message: chargeResult.failureMessage,
        failureCode: chargeResult.failureCode,
      });
    }

    const order = await this.prisma.$transaction(async (tx) => {
      let discountCents = 0;
      let couponCode: string | null = null;
      if (dto.couponCode) {
        const applied = await this.couponsService.applyAndConsume(
          dto.couponCode,
          subtotalCents,
          tx,
        );
        discountCents = applied.discountCents;
        couponCode = applied.coupon.code;
      }

      const taxCents = Math.round((subtotalCents - discountCents) * TAX_RATE);
      const deliveryFeeCents = DELIVERY_FEE_CENTS;
      const totalCents =
        subtotalCents - discountCents + taxCents + deliveryFeeCents;

      const created = await tx.order.create({
        data: {
          userId,
          addressId: dto.addressId,
          status: 'PENDING',
          paymentStatus: 'SUCCEEDED',
          subtotalCents,
          discountCents,
          couponCode,
          taxCents,
          deliveryFeeCents,
          totalCents,
          paymentCardLast4: chargeResult.cardLast4,
          paymentCardBrand: chargeResult.cardBrand,
          items: {
            create: cart.items.map((item) => ({
              productName: item.productName,
              sizeName: item.sizeName,
              crustName: item.crustName,
              toppingNames: item.toppingNames,
              unitPriceCents: item.unitPriceCents,
              quantity: item.quantity,
              lineTotalCents: item.lineTotalCents,
            })),
          },
          statusHistory: { create: { status: 'PENDING' } },
        },
        include: { items: true, statusHistory: true },
      });
      await tx.cartItem.deleteMany({ where: { cartId } });
      return created;
    });

    return this.toResponseDto(order);
  }

  async findById(userId: string, orderId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        statusHistory: { orderBy: { changedAt: 'asc' } },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order "${orderId}" not found`);
    }
    if (order.userId !== userId) {
      throw new ForbiddenException("You can't view another user's order");
    }
    return this.toResponseDto(await this.applyAutoProgress(order));
  }

  async findAllForUser(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        statusHistory: { orderBy: { changedAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const progressed = await Promise.all(
      orders.map((order) => this.applyAutoProgress(order)),
    );
    return progressed.map((order) => this.toResponseDto(order));
  }
}
