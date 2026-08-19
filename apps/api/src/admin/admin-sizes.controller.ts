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
import { AdminSizesService } from './admin-sizes.service';
import { SizeInputDto } from './dto/size-input.dto';
import { SizeResponseDto } from '../catalog/dto/size-response.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/sizes')
export class AdminSizesController {
  constructor(private readonly adminSizesService: AdminSizesService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List every size' })
  @ApiOkResponse({ type: [SizeResponseDto] })
  findAll(): Promise<SizeResponseDto[]> {
    return this.adminSizesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a size' })
  @ApiOkResponse({ type: SizeResponseDto })
  create(@Body() dto: SizeInputDto): Promise<SizeResponseDto> {
    return this.adminSizesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '[Admin] Update a size' })
  @ApiOkResponse({ type: SizeResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: SizeInputDto,
  ): Promise<SizeResponseDto> {
    return this.adminSizesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete a size' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.adminSizesService.remove(id);
  }
}
