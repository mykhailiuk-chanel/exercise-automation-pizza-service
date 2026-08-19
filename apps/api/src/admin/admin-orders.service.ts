import { Injectable, NotFoundException } from '@nestjs/common';
import type { OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { OrderStatus } from '@pizza/shared-types';
import { AdminOrderSummaryResponseDto } from './dto/admin-order-summary.dto';

@Injectable()
export class AdminOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AdminOrderSummaryResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => ({
      id: order.id,
      userEmail: order.user.email,
      status: order.status.toLowerCase() as OrderStatus,
      totalCents: order.totalCents,
      createdAt: order.createdAt.toISOString(),
      estimatedDeliveryAt: order.estimatedDeliveryAt?.toISOString() ?? null,
    }));
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order "${orderId}" not found`);
    }
    const prismaStatus = status.toUpperCase() as PrismaOrderStatus;
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: prismaStatus,
        statusHistory: { create: { status: prismaStatus } },
      },
    });
  }

  async remove(orderId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order "${orderId}" not found`);
    }
    await this.prisma.order.delete({ where: { id: orderId } });
  }

  async removeAll(): Promise<void> {
    await this.prisma.order.deleteMany({});
  }
}
