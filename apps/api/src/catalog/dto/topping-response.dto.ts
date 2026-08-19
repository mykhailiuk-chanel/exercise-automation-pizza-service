import { ApiProperty } from '@nestjs/swagger';
import type { ToppingDto } from '@pizza/shared-types';

export class ToppingResponseDto implements ToppingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ['meat', 'veggie', 'cheese', 'sauce'] })
  category: 'meat' | 'veggie' | 'cheese' | 'sauce';

  @ApiProperty()
  priceModifierCents: number;

  @ApiProperty()
  available: boolean;
}
