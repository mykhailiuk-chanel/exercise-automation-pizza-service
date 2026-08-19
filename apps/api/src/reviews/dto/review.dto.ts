import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min, MaxLength } from 'class-validator';
import type { ReviewDto, ReviewInput } from '@pizza/shared-types';

export class ReviewInputDto implements ReviewInput {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ maxLength: 2000 })
  @IsString()
  @MaxLength(2000)
  comment: string;
}

export class ReviewResponseDto implements ReviewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  authorName: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  isOwn: boolean;
}
