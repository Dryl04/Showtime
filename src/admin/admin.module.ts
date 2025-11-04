import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminApiController } from './admin.api.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { GroupsModule } from '../groups/groups.module';
import { ConcertsModule } from '../concerts/concerts.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Group, GroupSchema } from '../groups/schemas/group.schema';
import { Concert, ConcertSchema } from '../concerts/schemas/concert.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    GroupsModule,
    ConcertsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Concert.name, schema: ConcertSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [AdminController, AdminApiController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
