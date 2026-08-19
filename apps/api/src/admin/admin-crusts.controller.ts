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
import { AdminCrustsService } from './admin-crusts.service';
import { CrustInputDto } from './dto/crust-input.dto';
import { CrustResponseDto } from '../catalog/dto/crust-response.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/crusts')
export class AdminCrustsController {
  constructor(private readonly adminCrustsService: AdminCrustsService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List every crust' })
  @ApiOkResponse({ type: [CrustResponseDto] })
  findAll(): Promise<CrustResponseDto[]> {
    return this.adminCrustsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a crust' })
  @ApiOkResponse({ type: CrustResponseDto })
  create(@Body() dto: CrustInputDto): Promise<CrustResponseDto> {
    return this.adminCrustsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '[Admin] Update a crust' })
  @ApiOkResponse({ type: CrustResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: CrustInputDto,
  ): Promise<CrustResponseDto> {
    return this.adminCrustsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete a crust' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.adminCrustsService.remove(id);
  }
}
