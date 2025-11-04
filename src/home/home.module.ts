import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeController } from './home.controller';
import { Concert, ConcertSchema } from '../concerts/schemas/concert.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }]),
    AuthModule,
  ],
  controllers: [HomeController],
})
export class HomeModule {}
