import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Reads the client-generated `X-Cart-Id` header that identifies a guest
 * cart. There's no server-side session/cookie involved — the frontend
 * generates a UUID, stores it locally, and sends it on every cart request,
 * which also makes the cart trivially scriptable from Postman/RestAssured.
 */
export const CartId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const header = request.headers['x-cart-id'];
    const cartId = Array.isArray(header) ? header[0] : header;

    if (!cartId || !UUID_V4_PATTERN.test(cartId)) {
      throw new BadRequestException(
        'A valid X-Cart-Id header (UUID v4) is required',
      );
    }
    return cartId;
  },
);
