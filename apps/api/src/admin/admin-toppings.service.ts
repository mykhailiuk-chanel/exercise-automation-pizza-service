import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { ToppingCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { ToppingInput } from '@pizza/shared-types';
import { ToppingResponseDto } from '../catalog/dto/topping-response.dto';

@Injectable()
export class AdminToppingsService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponseDto(topping: {
    id: string;
    name: string;
    category: string;
    priceModifierCents: number;
    available: boolean;
  }): ToppingResponseDto {
    return {
      ...topping,
      category:
        topping.category.toLowerCase() as ToppingResponseDto['category'],
    };
  }

  async findAll(): Promise<ToppingResponseDto[]> {
    const toppings = await this.prisma.topping.findMany({
      orderBy: { name: 'asc' },
    });
    return toppings.map((t) => this.toResponseDto(t));
  }

  async create(dto: ToppingInput): Promise<ToppingResponseDto> {
    const created = await this.prisma.topping.create({
      data: { ...dto, category: dto.category.toUpperCase() as ToppingCategory },
    });
    return this.toResponseDto(created);
  }

  async update(id: string, dto: ToppingInput): Promise<ToppingResponseDto> {
    await this.assertExists(id);
    const updated = await this.prisma.topping.update({
      where: { id },
      data: { ...dto, category: dto.category.toUpperCase() as ToppingCategory },
    });
    return this.toResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    try {
      await this.prisma.topping.delete({ where: { id } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new BadRequestException(
          'This topping is used by existing products or cart items and cannot be deleted. Mark it unavailable instead.',
        );
      }
      throw err;
    }
  }

  private async assertExists(id: string): Promise<void> {
    const topping = await this.prisma.topping.findUnique({ where: { id } });
    if (!topping) {
      throw new NotFoundException(`Topping "${id}" not found`);
    }
  }
}
