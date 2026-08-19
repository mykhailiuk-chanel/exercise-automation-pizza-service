import { ApiProperty } from '@nestjs/swagger';
import type { CartItemDto } from '@pizza/shared-types';

export class CartItemResponseDto implements CartItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  sizeId: string;

  @ApiProperty()
  sizeName: string;

  @ApiProperty()
  crustId: string;

  @ApiProperty()
  crustName: string;

  @ApiProperty({ type: [String] })
  toppingIds: string[];

  @ApiProperty({ type: [String] })
  toppingNames: string[];

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPriceCents: number;

  @ApiProperty()
  lineTotalCents: number;
}
