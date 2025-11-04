import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Concert, ConcertDocument } from '../concerts/schemas/concert.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QrService } from '../qr/qr.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Concert.name) private concertModel: Model<ConcertDocument>,
    private qrService: QrService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { concert_id, quantity, user_id } = createBookingDto;
    const concert = await this.concertModel.findById(concert_id).exec();
    if (!concert) {
      throw new NotFoundException(
        `Concert avec l'ID "${concert_id}" introuvable`,
      );
    }

    if (concert.ticket_left < quantity) {
      throw new BadRequestException(
        `Pas assez de tickets disponibles. Disponibles: ${concert.ticket_left}, demandés: ${quantity}`,
      );
    }

    const total_price = concert.price * quantity;

    const booking = new this.bookingModel({
      user_id: new Types.ObjectId(user_id),
      concert_id: new Types.ObjectId(concert_id),
      quantity,
      total_price,
      qr_code: null,
    });

    concert.ticket_left -= quantity;
    concert.ticket_sold += quantity;

    const [savedBooking] = await Promise.all([booking.save(), concert.save()]);

    const bookingId = (savedBooking._id as Types.ObjectId).toString();
    const ticketUrl = this.qrService.generateTicketUrl(bookingId);
    const qrCodeDataURL = await this.qrService.generateQRCode(ticketUrl);

    savedBooking.qr_code = qrCodeDataURL;
    await savedBooking.save();

    return savedBooking;
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel
      .find()
      .populate('user_id', 'username email')
      .populate('concert_id', 'name_concert name_group date place')
      .exec();
  }

  async findByUser(userId: string): Promise<Booking[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID utilisateur invalide');
    }

    return this.bookingModel
      .find({ user_id: new Types.ObjectId(userId) })
      .populate(
        'concert_id',
        'name_concert name_group date place picture_url price',
      )
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Booking> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de réservation invalide');
    }

    const booking = await this.bookingModel
      .findById(id)
      .populate('user_id', 'username email')
      .populate('concert_id', 'name_concert name_group date place price')
      .exec();

    if (!booking) {
      throw new NotFoundException(`Réservation avec l'ID "${id}" introuvable`);
    }

    return booking;
  }

  async cancel(id: string, userId?: string): Promise<Booking> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de réservation invalide');
    }

    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Réservation avec l'ID "${id}" introuvable`);
    }

    if (userId && String(booking.user_id) !== userId) {
      throw new BadRequestException(
        'Vous ne pouvez annuler que vos propres réservations',
      );
    }

    const concert = await this.concertModel.findById(booking.concert_id).exec();
    if (concert) {
      concert.ticket_left += booking.quantity;
      concert.ticket_sold -= booking.quantity;
      await concert.save();
    }

    await this.bookingModel.findByIdAndDelete(id).exec();
    return booking;
  }
  async remove(id: string): Promise<Booking> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de réservation invalide');
    }

    const booking = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!booking) {
      throw new NotFoundException(`Réservation avec l'ID "${id}" introuvable`);
    }

    const concert = await this.concertModel.findById(booking.concert_id).exec();
    if (concert) {
      concert.ticket_left += booking.quantity;
      concert.ticket_sold -= booking.quantity;
      await concert.save();
    }

    return booking;
  }

  async getConcertDetails(concertId: string): Promise<Concert> {
    if (!Types.ObjectId.isValid(concertId)) {
      throw new BadRequestException('ID de concert invalide');
    }

    const concert = await this.concertModel.findById(concertId).exec();
    if (!concert) {
      throw new NotFoundException(`Concert avec l'ID "${concertId}" introuvable`);
    }

    return concert;
  }
}
