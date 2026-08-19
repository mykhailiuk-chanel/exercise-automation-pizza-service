import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/jwt.strategy';
import { AddressesService } from './addresses.service';
import { AddressInputDto, AddressResponseDto } from './dto/address.dto';

@ApiTags('addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: "List the current user's addresses" })
  @ApiOkResponse({ type: [AddressResponseDto] })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AddressResponseDto[]> {
    return this.addressesService.findAllForUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new address' })
  @ApiOkResponse({ type: AddressResponseDto })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddressInputDto,
  ): Promise<AddressResponseDto> {
    return this.addressesService.create(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an address' })
  @ApiOkResponse({ type: AddressResponseDto })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: AddressInputDto,
  ): Promise<AddressResponseDto> {
    return this.addressesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.addressesService.remove(user.id, id);
  }
}
