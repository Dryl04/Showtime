import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Render,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Concert } from './schemas/concert.schema';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Get('create/form')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Render('concerts/create')
  getCreateForm() {
    return {};
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const createConcertDto: any = {
        user_id: body.user_id || '507f1f77bcf86cd799439011',
        name_group: body.name_group,
        name_concert: body.name_concert,
        genre: body.genre,
        date: new Date(body.date),
        place: body.place,
        picture_url: body.picture_url || null,
        price: body.price ? parseFloat(body.price) : 0,
        number_of_ticket: body.number_of_ticket ? parseInt(body.number_of_ticket) : 0,
        ticket_left: body.number_of_ticket ? parseInt(body.number_of_ticket) : 0,
        ticket_sold: 0,
      };

      await this.concertService.create(createConcertDto);
      return res.redirect('/admin/dashboard');
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).render('concerts/create', {
        error: error.message || 'Erreur lors de la création du concert',
      });
    }
  }

  @Get()
  findAll() {
    return this.concertService.findAll();
  }

  @Get(':id/detail')
  @UseGuards(OptionalJwtAuthGuard)
  @Render('concerts/detail')
  async getConcertDetail(@Param('id') id: string, @Req() req: any) {
    const concert = await this.concertService.findById(id);
    if (!concert) {
      throw new NotFoundException(`Concert avec l'ID "${id}" introuvable`);
    }
    return { 
      concert,
      user: req.user || null,
    };
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    const concerts = await this.concertService.findByName(name);
    if (!concerts?.length) {
      throw new NotFoundException(`Aucun concert trouvé avec le nom "${name}"`);
    }
    return concerts;
  }

  @Get('group/:group_name')
  async findByGroupName(@Param('group_name') group_name: string) {
    const concerts = await this.concertService.findByGroupName(group_name);
    if (!concerts?.length) {
      throw new NotFoundException('Aucun concert trouvé pour le groupe');
    }
    return concerts;
  }

  @Get(':id/edit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Render('concerts/edit')
  async getEditForm(@Param('id') id: string) {
    const concert = await this.concertService.findById(id);
    if (!concert) {
      throw new NotFoundException(`Concert avec l'ID "${id}" introuvable`);
    }
    return { concert };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const updateConcertDto: any = {
        name_group: body.name_group,
        name_concert: body.name_concert,
        genre: body.genre,
        date: new Date(body.date),
        place: body.place,
        picture_url: body.picture_url || null,
        price: body.price ? parseFloat(body.price) : 0,
        number_of_ticket: body.number_of_ticket ? parseInt(body.number_of_ticket) : 0,
        ticket_left: body.number_of_ticket ? parseInt(body.number_of_ticket) : 0,
      };

      await this.concertService.update(id, updateConcertDto);
      return res.redirect('/admin/dashboard');
    } catch (error: any) {
      const concert = await this.concertService.findById(id);
      return res.status(HttpStatus.BAD_REQUEST).render('concerts/edit', {
        concert,
        error: error.message || 'Erreur lors de la modification du concert',
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    const deleted: Concert = await this.concertService.delete(id);
    return { message: 'Concert supprimé avec succès', deleted };
  }
}
