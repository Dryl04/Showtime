import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Render,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { AdminService } from './admin.service';
import { GroupsService } from '../groups/groups.service';
import { ConcertService } from '../concerts/concert.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
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
    return this.usersService.updateUserToAdmin(userId);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') userId: string) {
    await this.usersService.deleteUser(userId);
  }

  // DASHBOARD
  @Get('dashboard')
  @Render('admin/dashboard')
  async getDashboard() {
    try {
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
    } catch (error) {
      console.error('Erreur dashboard admin:', error);
      // Retourner des données vides en cas d'erreur
      return {
        kpis: {
          totalUsers: 0,
          totalGroups: 0,
          totalConcerts: 0,
          totalBookings: 0,
          totalRevenue: 0,
          ticketsSold: 0,
          ticketsAvailable: 0,
          recentBookings: 0,
          upcomingConcerts: 0,
        },
        recentActivity: [],
        users: [],
        groups: [],
        concerts: [],
        error: 'Erreur de connexion à la base de données',
      };
    }
  }

  // API pour récupérer les KPIs (pour AJAX)
  @Get('kpis')
  @HttpCode(HttpStatus.OK)
  async getKPIs() {
    return this.adminService.getDashboardKPIs();
  }

  // API pour récupérer l'activité récente
  @Get('activity')
  @HttpCode(HttpStatus.OK)
  async getRecentActivity() {
    return this.adminService.getRecentActivity();
  }
}
