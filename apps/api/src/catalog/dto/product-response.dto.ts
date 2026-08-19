import { ApiProperty } from '@nestjs/swagger';
import type { ProductDto } from '@pizza/shared-types';

export class ProductResponseDto implements ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  basePriceCents: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  isBuildYourOwnBase: boolean;

  @ApiProperty()
  available: boolean;

  @ApiProperty()
  ratingAverage: number;

  @ApiProperty()
  ratingCount: number;

  @ApiProperty({ type: [String] })
  defaultToppingIds: string[];
}
