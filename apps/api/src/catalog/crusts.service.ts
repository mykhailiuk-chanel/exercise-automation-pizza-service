import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrustResponseDto } from './dto/crust-response.dto';

@Injectable()
export class CrustsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CrustResponseDto[]> {
    return this.prisma.crust.findMany({ orderBy: { sortOrder: 'asc' } });
  }
}
