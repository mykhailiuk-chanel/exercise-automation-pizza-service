import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CouponType } from '@pizza/shared-types';
import type {
  CouponDto as CouponResponse,
  CouponInput,
  CouponType as CouponTypeType,
} from '@pizza/shared-types';

export class CouponInputDto implements CouponInput {
  @ApiProperty({ example: 'WELCOME10' })
  @IsString()
  code: string;

  @ApiProperty({ enum: Object.values(CouponType) })
  @IsIn(Object.values(CouponType))
  type: CouponTypeType;

  @ApiProperty({
    description:
      'Percent off (0-100) if type is percent, cents off if type is fixed',
  })
  @IsInt()
  @Min(0)
  value: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  minOrderAmountCents?: number;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CouponResponseDto implements CouponResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ enum: Object.values(CouponType) })
  type: CouponTypeType;

  @ApiProperty()
  value: number;

  @ApiProperty()
  minOrderAmountCents: number;

  @ApiProperty({ nullable: true })
  maxUses: number | null;

  @ApiProperty()
  usesCount: number;

  @ApiProperty({ nullable: true })
  expiresAt: string | null;

  @ApiProperty()
  active: boolean;
}
