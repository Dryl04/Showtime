import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('api/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistApiController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyWishlist(@Request() req: RequestWithUser) {
    const wishlist = await this.wishlistService.getUserWishlistWithDetails(req.user.userId);
    return {
      groups: wishlist?.groups || [],
      concerts: wishlist?.concerts || [],
    };
  }

  @Post('groups/:groupId')
  @HttpCode(HttpStatus.CREATED)
  async addGroup(
    @Request() req: RequestWithUser,
    @Param('groupId') groupId: string,
  ) {
    await this.wishlistService.addGroup(req.user.userId, groupId);
    return { message: 'Groupe ajouté à la wishlist', groupId };
  }

  @Delete('groups/:groupId')
  @HttpCode(HttpStatus.OK)
  async removeGroup(
    @Request() req: RequestWithUser,
    @Param('groupId') groupId: string,
  ) {
    await this.wishlistService.removeGroup(req.user.userId, groupId);
    return { message: 'Groupe retiré de la wishlist', groupId };
  }

  @Post('concerts/:concertId')
  @HttpCode(HttpStatus.CREATED)
  async addConcert(
    @Request() req: RequestWithUser,
    @Param('concertId') concertId: string,
  ) {
    await this.wishlistService.addConcert(req.user.userId, concertId);
    return { message: 'Concert ajouté à la wishlist', concertId };
  }

  @Delete('concerts/:concertId')
  @HttpCode(HttpStatus.OK)
  async removeConcert(
    @Request() req: RequestWithUser,
    @Param('concertId') concertId: string,
  ) {
    await this.wishlistService.removeConcert(req.user.userId, concertId);
    return { message: 'Concert retiré de la wishlist', concertId };
  }

  @Get('groups/:groupId/check')
  @HttpCode(HttpStatus.OK)
  async checkGroup(
    @Request() req: RequestWithUser,
    @Param('groupId') groupId: string,
  ) {
    const has = await this.wishlistService.hasGroup(req.user.userId, groupId);
    return { inWishlist: has, isFavorite: has };
  }

  @Get('concerts/:concertId/check')
  @HttpCode(HttpStatus.OK)
  async checkConcert(
    @Request() req: RequestWithUser,
    @Param('concertId') concertId: string,
  ) {
    const has = await this.wishlistService.hasConcert(
      req.user.userId,
      concertId,
    );
    return { inWishlist: has, isFavorite: has };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearWishlist(@Request() req: RequestWithUser) {
    await this.wishlistService.clearWishlist(req.user.userId);
    return { message: 'Wishlist vidée avec succès' };
  }
}
