import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const existingGroup = await this.groupModel.findOne({
      name: createGroupDto.name,
    });

    if (existingGroup) {
      throw new ConflictException('Un groupe avec ce nom existe déjà');
    }

    const group = new this.groupModel(createGroupDto);
    return group.save();
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().sort({ name: 1 }).exec();
  }

  async findById(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id).exec();
    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }
    return group;
  }

  async findByGenre(genre: string): Promise<Group[]> {
    return this.groupModel.find({ genre }).sort({ name: 1 }).exec();
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    if (updateGroupDto.name) {
      const existingGroup = await this.groupModel.findOne({
        name: updateGroupDto.name,
        _id: { $ne: id },
      });

      if (existingGroup) {
        throw new ConflictException('Un groupe avec ce nom existe déjà');
      }
    }

    const group = await this.groupModel.findByIdAndUpdate(
      id,
      { ...updateGroupDto, updatedAt: new Date() },
      { new: true },
    );

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    return group;
  }

  async delete(id: string): Promise<void> {
    const result = await this.groupModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Groupe non trouvé');
    }
  }

  async search(query: string): Promise<Group[]> {
    return this.groupModel
      .find({
        name: { $regex: query, $options: 'i' },
      })
      .sort({ name: 1 })
      .exec();
  }
}
