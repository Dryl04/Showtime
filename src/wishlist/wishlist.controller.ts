import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Render,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @Render('wishlist')
  async showWishlistPage(@Request() req: RequestWithUser) {
    const wishlist = await this.wishlistService.getUserWishlistWithDetails(req.user.userId);
    return {
      user: req.user,
      groups: wishlist?.groups || [],
      concerts: wishlist?.concerts || [],
    };
  }

  @Get('api')
  @HttpCode(HttpStatus.OK)
  async getMyWishlist(@Request() req: RequestWithUser) {
    return this.wishlistService.getUserWishlist(req.user.userId);
  }

  @Post('groups/:groupId')
  @HttpCode(HttpStatus.OK)
  async addGroup(
    @Request() req: RequestWithUser,
    @Param('groupId') groupId: string,
  ) {
    return this.wishlistService.addGroup(req.user.userId, groupId);
  }

  @Delete('groups/:groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeGroup(
    @Request() req: RequestWithUser,
    @Param('groupId') groupId: string,
  ) {
    await this.wishlistService.removeGroup(req.user.userId, groupId);
  }

  @Post('concerts/:concertId')
  @HttpCode(HttpStatus.OK)
  async addConcert(
    @Request() req: RequestWithUser,
    @Param('concertId') concertId: string,
  ) {
    return this.wishlistService.addConcert(req.user.userId, concertId);
  }

  @Delete('concerts/:concertId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeConcert(
    @Request() req: RequestWithUser,
    @Param('concertId') concertId: string,
  ) {
    await this.wishlistService.removeConcert(req.user.userId, concertId);
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearWishlist(@Request() req: RequestWithUser) {
    await this.wishlistService.clearWishlist(req.user.userId);
  }
}
