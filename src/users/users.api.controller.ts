import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: RequestWithUser) {
    const user = await this.usersService.findById(req.user.userId);
    if (user) {
      const userObject = (user as any).toObject();
      const { password, ...safeUser } = userObject;
      return { user: safeUser };
    }
    return { user: null };
  }

  @Put('name')
  @HttpCode(HttpStatus.OK)
  async updateName(
    @Request() req: RequestWithUser,
    @Body('name') name: string,
  ) {
    const user = await this.usersService.updateName(req.user.userId, name);
    const { password, ...safeUser } = (user as any).toObject();
    return { user: safeUser, message: 'Nom mis à jour avec succès' };
  }

  @Put('email')
  @HttpCode(HttpStatus.OK)
  async updateEmail(
    @Request() req: RequestWithUser,
    @Body('email') email: string,
  ) {
    const user = await this.usersService.updateEmail(req.user.userId, email);
    const { password, ...safeUser } = (user as any).toObject();
    return { user: safeUser, message: 'Email mis à jour avec succès' };
  }

  @Put('password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Request() req: RequestWithUser,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.usersService.updatePassword(
      req.user.userId,
      oldPassword,
      newPassword,
    );
    return { message: 'Mot de passe mis à jour avec succès' };
  }

  @Put('photo')
  @HttpCode(HttpStatus.OK)
  async updatePhoto(
    @Request() req: RequestWithUser,
    @Body('photo_url') photoUrl: string,
  ) {
    const user = await this.usersService.updatePhotoUrl(
      req.user.userId,
      photoUrl,
    );
    const { password, ...safeUser } = (user as any).toObject();
    return { user: safeUser, message: 'Photo mise à jour avec succès' };
  }

  @Delete('account')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Request() req: RequestWithUser) {
    await this.usersService.deleteUser(req.user.userId);
    return { message: 'Compte supprimé avec succès' };
  }
}
