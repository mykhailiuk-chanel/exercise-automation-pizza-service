import { ApiProperty } from '@nestjs/swagger';
import type { CrustDto } from '@pizza/shared-types';

export class CrustResponseDto implements CrustDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  priceModifierCents: number;

  @ApiProperty()
  sortOrder: number;
}
