import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('api/bookings')
@UseGuards(JwtAuthGuard)
export class BookingsApiController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: RequestWithUser,
  ) {
    createBookingDto.user_id = req.user.userId;
    const booking = await this.bookingsService.create(createBookingDto);
    return { message: 'Réservation créée avec succès', booking };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('my-bookings')
  @HttpCode(HttpStatus.OK)
  async getMyBookings(@Req() req: RequestWithUser) {
    return this.bookingsService.findByUser(req.user.userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Get(':id/ticket')
  @HttpCode(HttpStatus.OK)
  async getTicket(@Param('id') id: string, @Req() req: RequestWithUser) {
    const booking = await this.bookingsService.findOne(id);
    return { booking };
  }

  @Delete(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string, @Req() req: RequestWithUser) {
    const isAdmin = req.user.roles?.includes('admin');
    const userId = isAdmin ? undefined : req.user.userId;
    await this.bookingsService.cancel(id, userId);
    return { message: 'Réservation annulée avec succès' };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.bookingsService.remove(id);
    return { message: 'Réservation supprimée avec succès' };
  }

  @Get('concert/:concertId')
  @HttpCode(HttpStatus.OK)
  async getConcertDetails(@Param('concertId') concertId: string) {
    return this.bookingsService.getConcertDetails(concertId);
  }
}
