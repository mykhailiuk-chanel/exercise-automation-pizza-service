import { Module } from '@nestjs/common';
import { AdminOrdersController } from './admin-orders.controller';
import { AdminOrdersService } from './admin-orders.service';
import { AdminProductsController } from './admin-products.controller';
import { AdminProductsService } from './admin-products.service';
import { AdminToppingsController } from './admin-toppings.controller';
import { AdminToppingsService } from './admin-toppings.service';
import { AdminSizesController } from './admin-sizes.controller';
import { AdminSizesService } from './admin-sizes.service';
import { AdminCrustsController } from './admin-crusts.controller';
import { AdminCrustsService } from './admin-crusts.service';
import { AdminCouponsController } from './admin-coupons.controller';
import { AdminCouponsService } from './admin-coupons.service';

@Module({
  controllers: [
    AdminOrdersController,
    AdminProductsController,
    AdminToppingsController,
    AdminSizesController,
    AdminCrustsController,
    AdminCouponsController,
  ],
  providers: [
    AdminOrdersService,
    AdminProductsService,
    AdminToppingsService,
    AdminSizesService,
    AdminCrustsService,
    AdminCouponsService,
  ],
})
export class AdminModule {}
