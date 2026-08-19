import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
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

  async findAll(query: ProductQueryDto): Promise<PaginatedProductsDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 12;
    const where = {
      available: true,
      ...(query.category ? { category: { slug: query.category } } : {}),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { defaultToppings: true },
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: products.map((p) => this.toResponseDto(p)),
      total,
      page,
      pageSize,
    };
  }

  async findBySlug(slug: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { defaultToppings: true },
    });
    if (!product) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }
    return this.toResponseDto(product);
  }
}
