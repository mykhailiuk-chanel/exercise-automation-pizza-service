import { ApiProperty } from '@nestjs/swagger';
import type { UserDto, UserRole } from '@pizza/shared-types';

export class UserResponseDto implements UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: ['customer', 'admin'] })
  role: UserRole;
}
