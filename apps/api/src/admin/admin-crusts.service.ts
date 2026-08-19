import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CrustInput } from '@pizza/shared-types';
import { CrustResponseDto } from '../catalog/dto/crust-response.dto';

@Injectable()
export class AdminCrustsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CrustResponseDto[]> {
    return this.prisma.crust.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async create(dto: CrustInput): Promise<CrustResponseDto> {
    return this.prisma.crust.create({ data: dto });
  }

  async update(id: string, dto: CrustInput): Promise<CrustResponseDto> {
    await this.assertExists(id);
    return this.prisma.crust.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    try {
      await this.prisma.crust.delete({ where: { id } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new BadRequestException(
          'This crust is used by existing cart items or orders and cannot be deleted.',
        );
      }
      throw err;
    }
  }

  private async assertExists(id: string): Promise<void> {
    const crust = await this.prisma.crust.findUnique({ where: { id } });
    if (!crust) {
      throw new NotFoundException(`Crust "${id}" not found`);
    }
  }
}
