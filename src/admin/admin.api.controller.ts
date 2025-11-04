import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { AdminService } from './admin.service';
import { GroupsService } from '../groups/groups.service';
import { ConcertService } from '../concerts/concert.service';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminApiController {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
    private readonly groupsService: GroupsService,
    private readonly concertService: ConcertService,
  ) {}

  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Put('users/:id/make-admin')
  @HttpCode(HttpStatus.OK)
  async makeUserAdmin(@Param('id') userId: string) {
    const user = await this.usersService.updateUserToAdmin(userId);
    return { message: 'Utilisateur promu admin avec succès', user };
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') userId: string) {
    await this.usersService.deleteUser(userId);
    return { message: 'Utilisateur supprimé avec succès' };
  }

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboard() {
    const [kpis, recentActivity, users, groups, concerts] = await Promise.all([
      this.adminService.getDashboardKPIs(),
      this.adminService.getRecentActivity(10),
      this.usersService.findAll(),
      this.groupsService.findAll(),
      this.concertService.findAll(),
    ]);

    return {
      kpis,
      recentActivity,
      users,
      groups,
      concerts,
    };
  }

  @Get('kpis')
  @HttpCode(HttpStatus.OK)
  async getKPIs() {
    return this.adminService.getDashboardKPIs();
  }

  @Get('activity')
  @HttpCode(HttpStatus.OK)
  async getRecentActivity() {
    return this.adminService.getRecentActivity();
  }
}
