import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { seedDatabase, seedDemoUsers } from '../../prisma/seed';

@Injectable()
export class TestUtilsService {
  constructor(private readonly prisma: PrismaService) {}

  async reset(): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.orderStatusHistory.deleteMany(),
      this.prisma.orderItem.deleteMany(),
      this.prisma.order.deleteMany(),
      this.prisma.review.deleteMany(),
      this.prisma.cartItemTopping.deleteMany(),
      this.prisma.cartItem.deleteMany(),
      this.prisma.cart.deleteMany(),
      this.prisma.address.deleteMany(),
      this.prisma.refreshToken.deleteMany(),
      this.prisma.user.deleteMany(),
      this.prisma.productToppingDefault.deleteMany(),
      this.prisma.product.deleteMany(),
      this.prisma.category.deleteMany(),
      this.prisma.size.deleteMany(),
      this.prisma.crust.deleteMany(),
      this.prisma.topping.deleteMany(),
      this.prisma.coupon.deleteMany(),
    ]);
    await seedDatabase(this.prisma);
  }

  async seedDemoUser(): Promise<void> {
    await seedDemoUsers(this.prisma);
  }
}
