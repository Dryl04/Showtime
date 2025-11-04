import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/concerts')
export class ConcertsApiController {
  constructor(private readonly concertService: ConcertService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.concertService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getConcertById(@Param('id') id: string) {
    return this.concertService.findById(id);
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('name') name: string) {
    return this.concertService.findByName(name);
  }

  @Get('group/:group_name')
  @HttpCode(HttpStatus.OK)
  async findByGroupName(@Param('group_name') group_name: string) {
    return this.concertService.findByGroupName(group_name);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createConcertDto: CreateConcertDto) {
    const concert = await this.concertService.create(createConcertDto);
    return { message: 'Concert créé avec succès', concert };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateConcertDto: UpdateConcertDto,
  ) {
    const concert = await this.concertService.update(id, updateConcertDto);
    return { message: 'Concert mis à jour avec succès', concert };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const deleted = await this.concertService.delete(id);
    return { message: 'Concert supprimé avec succès', deleted };
  }
}
