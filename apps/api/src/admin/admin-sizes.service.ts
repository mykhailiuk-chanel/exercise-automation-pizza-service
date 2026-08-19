import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { SizeInput } from '@pizza/shared-types';
import { SizeResponseDto } from '../catalog/dto/size-response.dto';

@Injectable()
export class AdminSizesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SizeResponseDto[]> {
    return this.prisma.size.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async create(dto: SizeInput): Promise<SizeResponseDto> {
    return this.prisma.size.create({ data: dto });
  }

  async update(id: string, dto: SizeInput): Promise<SizeResponseDto> {
    await this.assertExists(id);
    return this.prisma.size.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    try {
      await this.prisma.size.delete({ where: { id } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new BadRequestException(
          'This size is used by existing cart items or orders and cannot be deleted.',
        );
      }
      throw err;
    }
  }

  private async assertExists(id: string): Promise<void> {
    const size = await this.prisma.size.findUnique({ where: { id } });
    if (!size) {
      throw new NotFoundException(`Size "${id}" not found`);
    }
  }
}
