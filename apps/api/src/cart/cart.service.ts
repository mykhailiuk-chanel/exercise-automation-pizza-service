import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemResponseDto } from './dto/cart-item-response.dto';

const cartItemInclude = {
  product: true,
  size: true,
  crust: true,
  toppings: { include: { topping: true } },
} satisfies Prisma.CartItemInclude;

type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: typeof cartItemInclude;
}>;

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService,
  ) {}

  private toItemResponseDto(item: CartItemWithRelations): CartItemResponseDto {
    return {
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      sizeId: item.sizeId,
      sizeName: item.size.name,
      crustId: item.crustId,
      crustName: item.crust.name,
      toppingIds: item.toppings.map((t) => t.toppingId),
      toppingNames: item.toppings.map((t) => t.topping.name),
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      lineTotalCents: item.unitPriceCents * item.quantity,
    };
  }

  private toCartResponseDto(
    cartId: string,
    items: CartItemWithRelations[],
  ): CartResponseDto {
    const itemDtos = items.map((item) => this.toItemResponseDto(item));
    return {
      id: cartId,
      items: itemDtos,
      itemCount: itemDtos.reduce((sum, i) => sum + i.quantity, 0),
      subtotalCents: itemDtos.reduce((sum, i) => sum + i.lineTotalCents, 0),
    };
  }

  async getCart(cartId: string): Promise<CartResponseDto> {
    const items = await this.prisma.cartItem.findMany({
      where: { cartId },
      include: cartItemInclude,
      orderBy: { createdAt: 'asc' },
    });
    return this.toCartResponseDto(cartId, items);
  }

  async addItem(cartId: string, dto: AddCartItemDto): Promise<CartResponseDto> {
    const { unitPriceCents } = await this.pricingService.priceSelection({
      productId: dto.productId,
      sizeId: dto.sizeId,
      crustId: dto.crustId,
      toppingIds: dto.toppingIds,
    });

    await this.prisma.cart.upsert({
      where: { id: cartId },
      update: {},
      create: { id: cartId },
    });

    await this.prisma.cartItem.create({
      data: {
        cartId,
        productId: dto.productId,
        sizeId: dto.sizeId,
        crustId: dto.crustId,
        quantity: dto.quantity,
        unitPriceCents,
        toppings: {
          create: dto.toppingIds.map((toppingId) => ({ toppingId })),
        },
      },
    });

    return this.getCart(cartId);
  }

  async updateItemQuantity(
    cartId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartResponseDto> {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
    });
    if (!item) {
      throw new NotFoundException(`Cart item "${itemId}" not found`);
    }
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    return this.getCart(cartId);
  }

  async removeItem(cartId: string, itemId: string): Promise<CartResponseDto> {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
    });
    if (!item) {
      throw new NotFoundException(`Cart item "${itemId}" not found`);
    }
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(cartId);
  }

  async clearCart(cartId: string): Promise<CartResponseDto> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });
    return this.getCart(cartId);
  }
}
