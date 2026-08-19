import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/jwt.strategy';
import { ReviewsService } from './reviews.service';
import { ReviewInputDto, ReviewResponseDto } from './dto/review.dto';

@ApiTags('reviews')
@Controller('products')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':slug/reviews')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'List reviews for a product',
    description:
      'Public — no auth required. If you send a valid Bearer token, your ' +
      'own review (if any) is flagged with isOwn: true.',
  })
  @ApiOkResponse({ type: [ReviewResponseDto] })
  findAll(
    @Param('slug') slug: string,
    @CurrentUser() user: AuthenticatedUser | null,
  ): Promise<ReviewResponseDto[]> {
    return this.reviewsService.findByProductSlug(slug, user?.id ?? null);
  }

  @Post(':slug/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create or update your review for a product',
    description:
      'One review per user per product — posting again updates your existing review.',
  })
  @ApiOkResponse({ type: ReviewResponseDto })
  upsert(
    @Param('slug') slug: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReviewInputDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.upsert(slug, user.id, dto);
  }

  @Delete(':slug/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete your review for a product' })
  async remove(
    @Param('slug') slug: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.reviewsService.remove(slug, user.id);
  }
}
