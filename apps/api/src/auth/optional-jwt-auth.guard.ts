import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedUser } from './jwt.strategy';

/**
 * Like JwtAuthGuard, but never rejects the request — `req.user` is set
 * when a valid Bearer token is present, and left `null` otherwise. For
 * endpoints that are public but behave slightly differently when the
 * caller happens to be logged in (e.g. marking "your own" review).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = AuthenticatedUser>(
    _err: unknown,
    user: TUser | false,
  ): TUser {
    return (user || null) as TUser;
  }
}
