import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddressInputDto, AddressResponseDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string): Promise<AddressResponseDto[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async create(
    userId: string,
    dto: AddressInputDto,
  ): Promise<AddressResponseDto> {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.create({ data: { ...dto, userId } });
  }

  async update(
    userId: string,
    addressId: string,
    dto: AddressInputDto,
  ): Promise<AddressResponseDto> {
    await this.assertOwnership(userId, addressId);
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.update({ where: { id: addressId }, data: dto });
  }

  async remove(userId: string, addressId: string): Promise<void> {
    await this.assertOwnership(userId, addressId);
    await this.prisma.address.delete({ where: { id: addressId } });
  }

  private async assertOwnership(
    userId: string,
    addressId: string,
  ): Promise<void> {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) {
      throw new NotFoundException(`Address "${addressId}" not found`);
    }
  }
}
