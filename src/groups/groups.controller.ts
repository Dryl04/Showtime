import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Render,
  Res,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @Render('groups/list')
  async getAllGroups(@Req() req: Request, @Query('genre') genre?: string) {
    let groups;
    if (genre) {
      groups = await this.groupsService.findByGenre(genre);
    } else {
      groups = await this.groupsService.findAll();
    }
    
    return {
      groups,
      user: req.user || null,
    };
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchGroups(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return this.groupsService.search(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getGroupById(@Param('id') id: string) {
    return this.groupsService.findById(id);
  }

  @Get(':id/detail')
  @UseGuards(OptionalJwtAuthGuard)
  @Render('groups/detail')
  async getGroupDetail(@Param('id') id: string, @Req() req: Request) {
    const group = await this.groupsService.findById(id);
    if (!group) {
      throw new Error(`Groupe avec l'ID "${id}" introuvable`);
    }
    return { 
      group,
      user: req.user || null,
    };
  }

  //ENDPOINTS ADMIN - PAGES

  @Get('create/form')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Render('groups/create')
  async getCreateForm() {
    return {};
  }

  @Get(':id/edit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Render('groups/edit')
  async getEditForm(@Param('id') id: string) {
    const group = await this.groupsService.findById(id);
    return { group };
  }

  //ENDPOINTS ADMIN - API

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.groupsService.create(createGroupDto);
      return res.redirect('/admin/dashboard');
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).render('groups/create', {
        error: error.message || 'Erreur lors de la création du groupe',
      });
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Res() res: Response,
  ) {
    try {
      await this.groupsService.update(id, updateGroupDto);
      return res.redirect('/admin/dashboard');
    } catch (error: any) {
      const group = await this.groupsService.findById(id);
      return res.status(HttpStatus.BAD_REQUEST).render('groups/edit', {
        group,
        error: error.message || 'Erreur lors de la modification du groupe',
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(@Param('id') id: string) {
    await this.groupsService.delete(id);
  }
}
