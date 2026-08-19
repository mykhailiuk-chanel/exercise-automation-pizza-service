import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { ToppingInput } from '@pizza/shared-types';

const TOPPING_CATEGORIES = ['meat', 'veggie', 'cheese', 'sauce'] as const;

export class ToppingInputDto implements ToppingInput {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: TOPPING_CATEGORIES })
  @IsIn(TOPPING_CATEGORIES)
  category: 'meat' | 'veggie' | 'cheese' | 'sauce';

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  priceModifierCents?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
