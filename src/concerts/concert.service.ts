import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Concert, ConcertDocument } from './schemas/concert.schema';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConcertService {
  constructor(
    @InjectModel(Concert.name) private concertModel: Model<ConcertDocument>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async findAll(): Promise<Concert[]> {
    return this.concertModel.find().exec();
  }

  async create(createConcertDto: CreateConcertDto): Promise<Concert> {
    const createdConcert = new this.concertModel(createConcertDto);
    const savedConcert = await createdConcert.save();

    try {
      await this.notificationsService.notifyNewConcertFromFavoriteGroup(
        savedConcert,
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi des notifications:', error);
    }

    return savedConcert;
  }

  async findByName(name: string): Promise<Concert[]> {
    return this.concertModel.find({ name_concert: name }).exec();
  }

  async findByGroupName(group_name: string): Promise<Concert[]> {
    return this.concertModel.find({ name_group: group_name }).exec();
  }

  async findById(id: string): Promise<Concert | null> {
    return this.concertModel.findById(id).exec();
  }

  async update(
    id: string,
    updateConcertDto: UpdateConcertDto,
  ): Promise<Concert> {
    const existingConcert = await this.concertModel.findById(id).exec();

    if (!existingConcert) {
      throw new NotFoundException(`Concert avec l'ID : "${id}" introuvable`);
    }

    if (updateConcertDto.name_group !== undefined) {
      existingConcert.name_group = updateConcertDto.name_group;
    }
    if (updateConcertDto.name_concert !== undefined) {
      existingConcert.name_concert = updateConcertDto.name_concert;
    }
    if (updateConcertDto.date !== undefined) {
      existingConcert.date = updateConcertDto.date;
    }
    if (updateConcertDto.genre !== undefined) {
      existingConcert.genre = updateConcertDto.genre;
    }
    if (updateConcertDto.place !== undefined) {
      existingConcert.place = updateConcertDto.place;
    }
    if (updateConcertDto.picture_url !== undefined) {
      existingConcert.picture_url = updateConcertDto.picture_url;
    }
    if (updateConcertDto.price !== undefined) {
      existingConcert.price = updateConcertDto.price;
    }
    if (updateConcertDto.number_of_ticket !== undefined) {
      existingConcert.number_of_ticket = updateConcertDto.number_of_ticket;
    }
    if (updateConcertDto.ticket_left !== undefined) {
      existingConcert.ticket_left = updateConcertDto.ticket_left;
    }

    return existingConcert.save();
  }

  async delete(id: string): Promise<Concert> {
    const deletedConcert = await this.concertModel.findByIdAndDelete(id).exec();

    if (!deletedConcert) {
      throw new NotFoundException(`Concert avec l'ID : "${id}" introuvable`);
    }

    return deletedConcert;
  }

  async findConcertsInNextDays(days: number): Promise<Concert[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return this.concertModel
      .find({
        date: {
          $gte: now,
          $lte: futureDate,
        },
      })
      .exec();
  }
}
