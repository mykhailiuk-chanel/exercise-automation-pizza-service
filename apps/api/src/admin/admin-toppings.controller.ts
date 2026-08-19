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
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminToppingsService } from './admin-toppings.service';
import { ToppingInputDto } from './dto/topping-input.dto';
import { ToppingResponseDto } from '../catalog/dto/topping-response.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/toppings')
export class AdminToppingsController {
  constructor(private readonly adminToppingsService: AdminToppingsService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List every topping' })
  @ApiOkResponse({ type: [ToppingResponseDto] })
  findAll(): Promise<ToppingResponseDto[]> {
    return this.adminToppingsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a topping' })
  @ApiOkResponse({ type: ToppingResponseDto })
  create(@Body() dto: ToppingInputDto): Promise<ToppingResponseDto> {
    return this.adminToppingsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '[Admin] Update a topping' })
  @ApiOkResponse({ type: ToppingResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: ToppingInputDto,
  ): Promise<ToppingResponseDto> {
    return this.adminToppingsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete a topping' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.adminToppingsService.remove(id);
  }
}
