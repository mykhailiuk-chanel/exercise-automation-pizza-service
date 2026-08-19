import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type { CouponPreviewDto } from '@pizza/shared-types';

export class PreviewCouponDto {
  @ApiProperty({ example: 'WELCOME10' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Cart subtotal in cents, before tax/delivery' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  subtotalCents: number;
}

export class CouponPreviewResponseDto implements CouponPreviewDto {
  @ApiProperty()
  valid: boolean;

  @ApiProperty()
  discountCents: number;

  @ApiProperty()
  message: string;
}
