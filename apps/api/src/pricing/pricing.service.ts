import { BadRequestException, Injectable } from '@nestjs/common';
import type { Crust, Product, Size, Topping } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface PriceableSelection {
  productId: string;
  sizeId: string;
  crustId: string;
  toppingIds: string[];
}

export interface PricedSelection {
  product: Product;
  size: Size;
  crust: Crust;
  toppings: Topping[];
  unitPriceCents: number;
}

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Single source of truth for pizza pricing: base product price + size
   * modifier + crust modifier + sum of topping modifiers. Used by the cart
   * (live preview) and, later, by checkout/order finalization — never trust
   * a client-computed price for the actual charge.
   */
  async priceSelection(
    selection: PriceableSelection,
  ): Promise<PricedSelection> {
    const uniqueToppingIds = [...new Set(selection.toppingIds)];

    const [product, size, crust, toppings] = await Promise.all([
      this.prisma.product.findUnique({ where: { id: selection.productId } }),
      this.prisma.size.findUnique({ where: { id: selection.sizeId } }),
      this.prisma.crust.findUnique({ where: { id: selection.crustId } }),
      this.prisma.topping.findMany({
        where: { id: { in: uniqueToppingIds } },
      }),
    ]);

    if (!product || !product.available) {
      throw new BadRequestException(
        `Product "${selection.productId}" is not available`,
      );
    }
    if (!size) {
      throw new BadRequestException(`Size "${selection.sizeId}" not found`);
    }
    if (!crust) {
      throw new BadRequestException(`Crust "${selection.crustId}" not found`);
    }
    if (toppings.length !== uniqueToppingIds.length) {
      throw new BadRequestException('One or more toppings were not found');
    }
    const unavailableTopping = toppings.find((t) => !t.available);
    if (unavailableTopping) {
      throw new BadRequestException(
        `Topping "${unavailableTopping.name}" is not available`,
      );
    }

    const unitPriceCents =
      product.basePriceCents +
      size.priceModifierCents +
      crust.priceModifierCents +
      toppings.reduce((sum, t) => sum + t.priceModifierCents, 0);

    return { product, size, crust, toppings, unitPriceCents };
  }
}
