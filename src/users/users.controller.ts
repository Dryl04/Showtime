import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Delete,
  Render,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Render('profile')
  async getProfile(@Request() req: RequestWithUser) {
    const user = await this.usersService.findById(req.user.userId);
    if (user) {
      const userObject = user.toObject();
      const { password, ...safeUser } = userObject;
      return { user: safeUser };
    }
    return { user: null };
  }

  @Put('name')
  async updateName(
    @Request() req: RequestWithUser,
    @Body('name') name: string,
    @Res() res: Response,
  ) {
    await this.usersService.updateName(req.user.userId, name);
    return res.redirect('/users/me');
  }

  @Put('email')
  async updateEmail(
    @Request() req: RequestWithUser,
    @Body('email') email: string,
    @Res() res: Response,
  ) {
    await this.usersService.updateEmail(req.user.userId, email);
    return res.redirect('/users/me');
  }

  @Put('password')
  async updatePassword(
    @Request() req: RequestWithUser,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Res() res: Response,
  ) {
    await this.usersService.updatePassword(
      req.user.userId,
      oldPassword,
      newPassword,
    );
    return res.redirect('/users/me');
  }

  @Put('photo')
  async updatePhoto(
    @Request() req: RequestWithUser,
    @Body('photo_url') photoUrl: string,
    @Res() res: Response,
  ) {
    await this.usersService.updatePhotoUrl(req.user.userId, photoUrl);
    return res.redirect('/users/me');
  }

  @Delete('account')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Request() req: RequestWithUser) {
    return this.usersService.deleteUser(req.user.userId);
  }
}
