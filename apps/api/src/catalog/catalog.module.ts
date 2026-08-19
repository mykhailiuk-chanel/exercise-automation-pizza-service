import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SizesController } from './sizes.controller';
import { SizesService } from './sizes.service';
import { CrustsController } from './crusts.controller';
import { CrustsService } from './crusts.service';
import { ToppingsController } from './toppings.controller';
import { ToppingsService } from './toppings.service';

@Module({
  controllers: [
    CategoriesController,
    ProductsController,
    SizesController,
    CrustsController,
    ToppingsController,
  ],
  providers: [
    CategoriesService,
    ProductsService,
    SizesService,
    CrustsService,
    ToppingsService,
  ],
})
export class CatalogModule {}
