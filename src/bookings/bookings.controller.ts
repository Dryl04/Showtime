import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Render,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('book/:concertId')
  @Render('bookings/booking-form')
  async showBookingForm(
    @Param('concertId') concertId: string,
    @Req() req: RequestWithUser,
  ) {
    try {
      const concert = await this.bookingsService.getConcertDetails(concertId);
      if (!concert) {
        throw new NotFoundException('Concert non trouvé');
      }
      
      return {
        concert,
        user: req.user,
      };
    } catch (error) {
      throw new NotFoundException('Concert non trouvé');
    }
  }

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      createBookingDto.user_id = req.user.userId;
      const booking: any = await this.bookingsService.create(createBookingDto);
      
      return res.redirect(`/bookings/my-bookings`);
    } catch (error: any) {
      const concert = await this.bookingsService.getConcertDetails(createBookingDto.concert_id);
      return res.status(HttpStatus.BAD_REQUEST).render('bookings/booking-form', {
        concert,
        user: req.user,
        error: error.message || 'Erreur lors de la réservation',
      });
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('my-bookings')
  @Render('bookings/my-bookings')
  async getMyBookings(@Req() req: RequestWithUser) {
    const bookings = await this.bookingsService.findByUser(req.user.userId);
    return {
      bookings,
      user: req.user,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Delete(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const isAdmin = req.user.roles?.includes('admin');
    const userId = isAdmin ? undefined : req.user.userId;
    await this.bookingsService.cancel(id, userId);
    return res.redirect('/bookings/my-bookings');
  }

  @Get(':id/ticket')
  @Render('bookings/ticket-detail')
  async showTicket(@Param('id') id: string, @Req() req: RequestWithUser) {
    const booking: any = await this.bookingsService.findOne(id);
    return {
      booking,
      user: req.user,
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
