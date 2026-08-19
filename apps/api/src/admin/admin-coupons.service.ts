import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CouponInput } from '@pizza/shared-types';
import { CouponResponseDto } from './dto/coupon.dto';

@Injectable()
export class AdminCouponsService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponseDto(coupon: {
    id: string;
    code: string;
    type: string;
    value: number;
    minOrderAmountCents: number;
    maxUses: number | null;
    usesCount: number;
    expiresAt: Date | null;
    active: boolean;
  }): CouponResponseDto {
    return {
      ...coupon,
      type: coupon.type.toLowerCase() as CouponResponseDto['type'],
      expiresAt: coupon.expiresAt?.toISOString() ?? null,
    };
  }

  async findAll(): Promise<CouponResponseDto[]> {
    const coupons = await this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return coupons.map((c) => this.toResponseDto(c));
  }

  async create(dto: CouponInput): Promise<CouponResponseDto> {
    const created = await this.prisma.coupon.create({
      data: {
        ...dto,
        code: dto.code.toUpperCase(),
        type: dto.type.toUpperCase() as 'PERCENT' | 'FIXED',
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
    return this.toResponseDto(created);
  }

  async update(id: string, dto: CouponInput): Promise<CouponResponseDto> {
    await this.assertExists(id);
    const updated = await this.prisma.coupon.update({
      where: { id },
      data: {
        ...dto,
        code: dto.code.toUpperCase(),
        type: dto.type.toUpperCase() as 'PERCENT' | 'FIXED',
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
    return this.toResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    await this.prisma.coupon.delete({ where: { id } });
  }

  private async assertExists(id: string): Promise<void> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException(`Coupon "${id}" not found`);
    }
  }
}
