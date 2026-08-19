import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SizeResponseDto } from './dto/size-response.dto';

@Injectable()
export class SizesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SizeResponseDto[]> {
    return this.prisma.size.findMany({ orderBy: { sortOrder: 'asc' } });
  }
}
