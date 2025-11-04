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
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/groups')
export class GroupsApiController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllGroups(@Query('genre') genre?: string) {
    if (genre) {
      return this.groupsService.findByGenre(genre);
    }
    return this.groupsService.findAll();
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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    const group = await this.groupsService.create(createGroupDto);
    return { message: 'Groupe créé avec succès', group };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const group = await this.groupsService.update(id, updateGroupDto);
    return { message: 'Groupe mis à jour avec succès', group };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async deleteGroup(@Param('id') id: string) {
    await this.groupsService.delete(id);
    return { message: 'Groupe supprimé avec succès' };
  }
}
