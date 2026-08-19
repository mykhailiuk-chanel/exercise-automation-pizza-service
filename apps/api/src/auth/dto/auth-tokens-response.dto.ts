import { ApiProperty } from '@nestjs/swagger';
import type { AuthTokensDto } from '@pizza/shared-types';
import { UserResponseDto } from './user-response.dto';

export class AuthTokensResponseDto implements AuthTokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
