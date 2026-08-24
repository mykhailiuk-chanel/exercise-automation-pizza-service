import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import type { AddCartItemInput } from '@pizza/shared-types';

const MAX_TOPPINGS = 5;

export class AddCartItemDto implements AddCartItemInput {
  @ApiProperty({
    description:
      'Product id (a preset pizza, side, drink, or the "build your own" base product)',
  })
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsUUID()
  sizeId: string;

  @ApiProperty()
  @IsUUID()
  crustId: string;

  @ApiPropertyOptional({
    type: [String],
    default: [],
    maxItems: MAX_TOPPINGS,
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(MAX_TOPPINGS)
  @IsUUID('4', { each: true })
  toppingIds: string[] = [];

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number = 1;
}
