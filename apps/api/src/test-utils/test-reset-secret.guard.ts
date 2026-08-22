import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class TestResetSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.TEST_RESET_SECRET;
    if (!expected) return false;

    const request = context.switchToHttp().getRequest<Request>();
    return request.headers['x-test-reset-secret'] === expected;
  }
}
