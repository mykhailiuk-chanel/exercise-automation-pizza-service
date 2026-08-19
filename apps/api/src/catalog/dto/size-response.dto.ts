import { ApiProperty } from '@nestjs/swagger';
import type { SizeDto } from '@pizza/shared-types';

export class SizeResponseDto implements SizeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  priceModifierCents: number;

  @ApiProperty()
  sortOrder: number;
}
