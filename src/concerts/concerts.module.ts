import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Concert, ConcertSchema } from './schemas/concert.schema';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { ConcertsApiController } from './concerts.api.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [ConcertController, ConcertsApiController],
  providers: [ConcertService],
  exports: [ConcertService],
})
export class ConcertsModule {}
