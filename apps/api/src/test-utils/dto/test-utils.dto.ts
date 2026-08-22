import { ApiProperty } from '@nestjs/swagger';

export class TestResetResponseDto {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty()
  resetAt: string;
}

export class TestSeedDemoUserResponseDto {
  @ApiProperty({ example: 'ok' })
  status: 'ok';
}
