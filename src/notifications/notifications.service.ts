import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification, NotificationType } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MailService } from './Mail/mail.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private readonly mailService: MailService,
    private readonly wishlistService: WishlistService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      const createdNotification = new this.notificationModel({
        ...createNotificationDto,
        user_id: new Types.ObjectId(createNotificationDto.user_id),
      });
      const savedNotification = await createdNotification.save();

      await this.sendRealEmail(savedNotification);

      return savedNotification;
    } catch (error) {
      this.logger.error(
        `Erreur création notification: ${(error as Error).message}`,
      );
      throw new Error('Erreur lors de la création de la notification');
    }
  }

  private async sendRealEmail(notification: Notification): Promise<void> {
    try {
      const user = await this.usersService.findById(
        notification.user_id.toString(),
      );
      if (!user) {
        this.logger.warn(
          `Utilisateur ${notification.user_id.toString()} non trouvé`,
        );
        return;
      }

      if (notification.type === NotificationType.CONCERT_REMINDER) {
        const concertMatch = notification.message.match(
          /Rappel pour votre concert (.+?) le (.+?)( à (.+))?/,
        );

        await this.mailService.sendConcertReminder(user.email, {
          concert_name: concertMatch ? concertMatch[1] : 'Concert',
          date: concertMatch ? concertMatch[2] : 'Date inconnue',
          location:
            concertMatch && concertMatch[4] ? concertMatch[4] : undefined,
          titre: notification.titre,
          message: notification.message,
        });
      } else if (notification.type === NotificationType.ARTIST_EVENT) {
        const artistMatch = notification.titre.match(/(.+) - (.+)/);

        await this.mailService.sendArtistEvent(user.email, {
          artist_name: artistMatch ? artistMatch[1] : 'Artiste',
          event_type: artistMatch ? artistMatch[2] : 'Événement',
          event_details: notification.message,
          titre: notification.titre,
          message: notification.message,
        });
      } else if (notification.type === NotificationType.NEW_CONCERT_FROM_FAVORITE_GROUP) {
       
        const groupNameMatch = notification.titre.match(/Nouveau concert de (.+?) !/);
        const concertDetailsMatch = notification.message.match(
          /(.+?) aura lieu le (.+?) à (.+?)\. Prix: (.+?)€/
        );

        await this.mailService.sendNewConcertNotification(user.email, {
          user_name: user.name,
          group_name: groupNameMatch ? groupNameMatch[1] : 'votre groupe favori',
          concert_name: concertDetailsMatch ? concertDetailsMatch[1] : 'Concert',
          date: concertDetailsMatch ? concertDetailsMatch[2] : 'Date à venir',
          place: concertDetailsMatch ? concertDetailsMatch[3] : 'Lieu à confirmer',
          price: concertDetailsMatch ? parseFloat(concertDetailsMatch[4]) : 0,
          action_url: notification.action_url || '/concerts',
        });
      }
    } catch (error) {
      this.logger.error(`Erreur envoi email: ${(error as Error).message}`);
      this.logger.warn('Email non envoyé mais notification sauvegardée');
    }
  }

  async sendConcertReminder(params: {
    user_id: string;
    concert_name: string;
    date: string;
    location?: string;
  }): Promise<Notification> {
    try {
      const titre = `Rappel: ${params.concert_name}`;
      const message = `Rappel pour votre concert ${params.concert_name} le ${params.date}${params.location ? ` à ${params.location}` : ''}`;

      return await this.create({
        user_id: params.user_id,
        type: NotificationType.CONCERT_REMINDER,
        titre,
        message,
      });
    } catch (error) {
      this.logger.error(`Erreur rappel concert: ${(error as Error).message}`);
      throw new Error("Erreur lors de l'envoi du rappel de concert");
    }
  }

  async sendArtistEvent(params: {
    user_id: string;
    artist_name: string;
    event_type: string;
    event_details: string;
  }): Promise<Notification> {
    try {
      const titre = `${params.artist_name} - ${params.event_type}`;
      const message = `${params.event_type}: ${params.event_details}`;

      return await this.create({
        user_id: params.user_id,
        type: NotificationType.ARTIST_EVENT,
        titre,
        message,
      });
    } catch (error) {
      this.logger.error(
        `Erreur notification artiste: ${(error as Error).message}`,
      );
      throw new Error("Erreur lors de l'envoi de la notification artiste");
    }
  }


  async notifyNewConcertFromFavoriteGroup(concert: any): Promise<void> {
    try {
      this.logger.log(
        ` Notification nouveau concert: ${concert.name_concert} de ${concert.name_group}`,
      );

      const userIds = await this.wishlistService.getUsersWithFavoriteGroupByName(
        concert.name_group,
      );

      if (userIds.length === 0) {
        this.logger.log(
          `Aucun utilisateur avec ${concert.name_group} en favori`,
        );
        return;
      }

      this.logger.log(
        ` Envoi de ${userIds.length} emails pour ${concert.name_group}`,
      );

      let successCount = 0;
      for (const userId of userIds) {
        try {
          const user = await this.usersService.findById(userId);
          if (!user) {
            this.logger.warn(`Utilisateur ${userId} non trouvé`);
            continue;
          }

          await this.mailService.sendNewConcertNotification(user.email, {
            user_name: user.name,
            group_name: concert.name_group,
            concert_name: concert.name_concert,
            date: new Date(concert.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            place: concert.place,
            price: concert.price,
            action_url: `http://localhost:3000/concerts/${concert._id}/detail`,
          });

          successCount++;
          this.logger.log(`Email envoyé à ${user.email}`);
        } catch (error) {
          this.logger.error(
            `Erreur envoi email à l'utilisateur ${userId}: ${(error as Error).message}`,
          );
        }
      }

      this.logger.log(
        ` ${successCount}/${userIds.length} emails envoyés avec succès`,
      );
    } catch (error) {
      this.logger.error(
        ` Erreur notification nouveau concert: ${(error as Error).message}`,
      );
    }
  }
}