import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { PaymentsModule } from '../payments/payments.module';
import { CouponsModule } from '../coupons/coupons.module';
import { CaptchaModule } from '../captcha/captcha.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [CartModule, PaymentsModule, CouponsModule, CaptchaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
