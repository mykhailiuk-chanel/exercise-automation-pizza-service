import { Controller, Post, UseGuards, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestUtilsService } from './test-utils.service';
import { TestResetSecretGuard } from './test-reset-secret.guard';
import {
  TestResetResponseDto,
  TestSeedDemoUserResponseDto,
} from './dto/test-utils.dto';

@ApiTags('test-utils')
@Controller({ path: 'test', version: VERSION_NEUTRAL })
export class TestUtilsController {
  constructor(private readonly testUtilsService: TestUtilsService) {}

  @Post('reset')
  @UseGuards(TestResetSecretGuard)
  @ApiHeader({ name: 'X-Test-Reset-Secret', required: true })
  @ApiOperation({
    summary: 'Wipe every table and reseed the original demo baseline',
    description:
      'Destructive — clears all orders, reviews, carts, addresses, and users, then reseeds ' +
      'the catalog, coupons, and the two demo accounts. Requires the X-Test-Reset-Secret header.',
  })
  async reset(): Promise<TestResetResponseDto> {
    await this.testUtilsService.reset();
    return { status: 'ok', resetAt: new Date().toISOString() };
  }

  @Post('seed-demo-user')
  @ApiOperation({
    summary: 'Re-create the two demo accounts if they were deleted or edited',
    description:
      'Non-destructive — only upserts the demo admin and demo customer accounts.',
  })
  async seedDemoUser(): Promise<TestSeedDemoUserResponseDto> {
    await this.testUtilsService.seedDemoUser();
    return { status: 'ok' };
  }
}
