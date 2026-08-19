import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { ProductInput } from '@pizza/shared-types';
import { ProductResponseDto } from '../catalog/dto/product-response.dto';

@Injectable()
export class AdminProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponseDto(product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    basePriceCents: number;
    categoryId: string;
    imageUrl: string;
    isBuildYourOwnBase: boolean;
    available: boolean;
    ratingAverage: number;
    ratingCount: number;
    defaultToppings: { toppingId: string }[];
  }): ProductResponseDto {
    const { defaultToppings, ...rest } = product;
    return {
      ...rest,
      defaultToppingIds: defaultToppings.map((dt) => dt.toppingId),
    };
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      include: { defaultToppings: true },
      orderBy: { name: 'asc' },
    });
    return products.map((p) => this.toResponseDto(p));
  }

  async create(dto: ProductInput): Promise<ProductResponseDto> {
    const { defaultToppingIds, ...rest } = dto;
    const created = await this.prisma.product.create({
      data: {
        ...rest,
        defaultToppings: defaultToppingIds?.length
          ? { create: defaultToppingIds.map((toppingId) => ({ toppingId })) }
          : undefined,
      },
      include: { defaultToppings: true },
    });
    return this.toResponseDto(created);
  }

  async update(id: string, dto: ProductInput): Promise<ProductResponseDto> {
    await this.assertExists(id);
    const { defaultToppingIds, ...rest } = dto;
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(defaultToppingIds
          ? {
              defaultToppings: {
                deleteMany: {},
                create: defaultToppingIds.map((toppingId) => ({ toppingId })),
              },
            }
          : {}),
      },
      include: { defaultToppings: true },
    });
    return this.toResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new BadRequestException(
          'This product is referenced by existing cart items or orders and cannot be deleted. Mark it unavailable instead.',
        );
      }
      throw err;
    }
  }

  private async assertExists(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product "${id}" not found`);
    }
  }
}
