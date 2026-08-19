import { BadRequestException, Injectable } from '@nestjs/common';
import type { Coupon, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CouponPreviewResponseDto } from './dto/coupon-preview.dto';

export interface AppliedCoupon {
  coupon: Coupon;
  discountCents: number;
}

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Throws BadRequestException with a specific, testable message on any
   * invalid state. Used both by the public preview endpoint (caught and
   * turned into a friendly {valid:false} response) and by checkout
   * (allowed to propagate — checkout's other validation failures also
   * throw BadRequestException, so this stays consistent).
   */
  private async validate(
    code: string,
    subtotalCents: number,
    client: Prisma.TransactionClient | PrismaService = this.prisma,
  ): Promise<AppliedCoupon> {
    const coupon = await client.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!coupon || !coupon.active) {
      throw new BadRequestException(`Coupon "${code}" is not valid`);
    }
    if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException(`Coupon "${code}" has expired`);
    }
    if (coupon.maxUses !== null && coupon.usesCount >= coupon.maxUses) {
      throw new BadRequestException(
        `Coupon "${code}" has reached its usage limit`,
      );
    }
    if (subtotalCents < coupon.minOrderAmountCents) {
      throw new BadRequestException(
        `Coupon "${code}" requires a minimum order of ${(coupon.minOrderAmountCents / 100).toFixed(2)}`,
      );
    }

    const discountCents =
      coupon.type === 'PERCENT'
        ? Math.round((subtotalCents * coupon.value) / 100)
        : Math.min(coupon.value, subtotalCents);

    return { coupon, discountCents };
  }

  async preview(
    code: string,
    subtotalCents: number,
  ): Promise<CouponPreviewResponseDto> {
    try {
      const { discountCents } = await this.validate(code, subtotalCents);
      return {
        valid: true,
        discountCents,
        message: `Coupon applied — you saved $${(discountCents / 100).toFixed(2)}`,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid coupon';
      return { valid: false, discountCents: 0, message };
    }
  }

  /** Validates and increments usage atomically within the checkout transaction. */
  async applyAndConsume(
    code: string,
    subtotalCents: number,
    tx: Prisma.TransactionClient,
  ): Promise<AppliedCoupon> {
    const result = await this.validate(code, subtotalCents, tx);
    await tx.coupon.update({
      where: { id: result.coupon.id },
      data: { usesCount: { increment: 1 } },
    });
    return result;
  }
}
