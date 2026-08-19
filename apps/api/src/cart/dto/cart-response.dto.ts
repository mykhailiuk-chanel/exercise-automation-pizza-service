import { ApiProperty } from '@nestjs/swagger';
import type { CartDto } from '@pizza/shared-types';
import { CartItemResponseDto } from './cart-item-response.dto';

export class CartResponseDto implements CartDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  subtotalCents: number;
}
