import { ApiProperty } from '@nestjs/swagger';
import type { CategoryDto } from '@pizza/shared-types';

export class CategoryResponseDto implements CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  sortOrder: number;
}
