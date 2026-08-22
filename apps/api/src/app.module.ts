import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './addresses/addresses.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CouponsModule } from './coupons/coupons.module';
import { AdminModule } from './admin/admin.module';
import { CaptchaModule } from './captcha/captcha.module';
import { TestUtilsModule } from './test-utils/test-utils.module';

// Only registered when explicitly enabled — when disabled, /api/test/* 404s
// outright rather than existing behind an auth check.
const testUtilsImports =
  process.env.ENABLE_TEST_UTILS === 'true' ? [TestUtilsModule] : [];

@Module({
  imports: [
    PrismaModule,
    CatalogModule,
    CartModule,
    AuthModule,
    AddressesModule,
    PaymentsModule,
    OrdersModule,
    ReviewsModule,
    CouponsModule,
    AdminModule,
    CaptchaModule,
    ...testUtilsImports,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
