import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsApiController } from './bookings.api.controller';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Concert, ConcertSchema } from '../concerts/schemas/concert.schema';
import { ConcertsModule } from '../concerts/concerts.module';
import { QrModule } from '../qr/qr.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Concert.name, schema: ConcertSchema },
    ]),
    ConcertsModule,
    QrModule,
  ],
  controllers: [BookingsController, BookingsApiController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
