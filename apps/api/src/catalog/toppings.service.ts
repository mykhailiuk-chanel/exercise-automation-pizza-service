import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ToppingResponseDto } from './dto/topping-response.dto';

@Injectable()
export class ToppingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ToppingResponseDto[]> {
    const toppings = await this.prisma.topping.findMany({
      orderBy: { name: 'asc' },
    });
    return toppings.map((topping) => ({
      ...topping,
      category:
        topping.category.toLowerCase() as ToppingResponseDto['category'],
    }));
  }
}
