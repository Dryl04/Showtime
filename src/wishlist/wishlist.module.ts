import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistController } from './wishlist.controller';
import { WishlistApiController } from './wishlist.api.controller';
import { WishlistService } from './wishlist.service';
import { Wishlist, WishlistSchema } from './schemas/wishlist.schema';
import { Group, GroupSchema } from '../groups/schemas/group.schema';
import { Concert, ConcertSchema } from '../concerts/schemas/concert.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wishlist.name, schema: WishlistSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Concert.name, schema: ConcertSchema },
    ]),
  ],
  controllers: [WishlistController, WishlistApiController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
