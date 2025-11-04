import {
  Controller,
  Get,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Concert, ConcertDocument } from '../concerts/schemas/concert.schema';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller()
export class HomeController {
  constructor(
    @InjectModel(Concert.name)
    private readonly concertModel: Model<ConcertDocument>,
  ) {}

  @Get('/')
  @UseGuards(OptionalJwtAuthGuard)
  @Render('index')
  async getHome(@Req() req: Request) {
    const concerts = await this.concertModel
      .find()
      .sort({ date: 1 })
      .limit(12)
      .lean();

    const featuredConcert =
      concerts.length > 0
        ? concerts[Math.floor(Math.random() * concerts.length)]
        : null;

    return {
      user: req.user || null,
      concerts,
      featuredConcert,
    };
  }
}
