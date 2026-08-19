import { Injectable, NotFoundException } from '@nestjs/common';
import type { Review, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewInputDto, ReviewResponseDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponseDto(
    review: Review & { user: Pick<User, 'firstName' | 'lastName'> },
    currentUserId: string | null,
  ): ReviewResponseDto {
    return {
      id: review.id,
      productId: review.productId,
      authorName: `${review.user.firstName} ${review.user.lastName.charAt(0)}.`,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      isOwn: review.userId === currentUserId,
    };
  }

  private async getProductOrThrow(slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }
    return product;
  }

  private async recomputeRating(productId: string): Promise<void> {
    const agg = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });
    await this.prisma.product.update({
      where: { id: productId },
      data: {
        ratingAverage: agg._avg.rating ?? 0,
        ratingCount: agg._count,
      },
    });
  }

  async findByProductSlug(
    slug: string,
    currentUserId: string | null,
  ): Promise<ReviewResponseDto[]> {
    const product = await this.getProductOrThrow(slug);
    const reviews = await this.prisma.review.findMany({
      where: { productId: product.id },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reviews.map((r) => this.toResponseDto(r, currentUserId));
  }

  async upsert(
    slug: string,
    userId: string,
    dto: ReviewInputDto,
  ): Promise<ReviewResponseDto> {
    const product = await this.getProductOrThrow(slug);
    const review = await this.prisma.review.upsert({
      where: { productId_userId: { productId: product.id, userId } },
      create: { productId: product.id, userId, ...dto },
      update: { ...dto },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    await this.recomputeRating(product.id);
    return this.toResponseDto(review, userId);
  }

  async remove(slug: string, userId: string): Promise<void> {
    const product = await this.getProductOrThrow(slug);
    const review = await this.prisma.review.findUnique({
      where: { productId_userId: { productId: product.id, userId } },
    });
    if (!review) {
      throw new NotFoundException("You haven't reviewed this product");
    }
    await this.prisma.review.delete({ where: { id: review.id } });
    await this.recomputeRating(product.id);
  }
}
