import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { AuthenticatedUser } from './jwt.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new account',
    description:
      'Returns an access token (short-lived JWT, use as `Authorization: Bearer <token>`) ' +
      'and a refresh token (opaque, use with POST /auth/refresh to get a new pair).',
  })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  register(@Body() dto: RegisterDto): Promise<AuthTokensResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  login(@Body() dto: LoginDto): Promise<AuthTokensResponseDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Exchange a refresh token for a new access/refresh token pair',
    description:
      'Refresh tokens are rotated: the one you send is revoked, and you get a new one back. ' +
      'Reusing an already-rotated refresh token fails with 401.',
  })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  refresh(@Body() dto: RefreshDto): Promise<AuthTokensResponseDto> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Revoke a refresh token' })
  async logout(@Body() dto: RefreshDto): Promise<void> {
    await this.authService.logout(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiOkResponse({ type: UserResponseDto })
  me(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
    return this.authService.getById(user.id);
  }
}
