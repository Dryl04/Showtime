import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendConcertReminder(email: string, data: {
    concert_name: string;
    date: string;
    location?: string;
    titre: string;
    message: string;
  }) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: data.titre,
        template: 'concert-reminder',
        context: {
          concert_name: data.concert_name,
          date: data.date,
          location: data.location,
          titre: data.titre,
          message: data.message
        },
      });

      this.logger.log(`✅ Email de rappel de concert envoyé à: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email concert: ${error.message}`);
      throw new Error('Erreur lors de l\'envoi de l\'email de rappel');
    }
  }

  async sendArtistEvent(email: string, data: {
    artist_name: string;
    event_type: string;
    event_details: string;
    titre: string;
    message: string;
  }) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: data.titre,
        template: 'artist-event',
        context: {
          artist_name: data.artist_name,
          event_type: data.event_type,
          event_details: data.event_details,
          titre: data.titre,
          message: data.message
        },
      });
      
      this.logger.log(`✅ Email d'événement artiste envoyé à: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email artiste: ${error.message}`);
      throw new Error('Erreur lors de l\'envoi de l\'email d\'artiste');
    }
  }

  async sendNewConcertNotification(email: string, data: {
    user_name: string;
    group_name: string;
    concert_name: string;
    date: string;
    place: string;
    price: number;
    action_url: string;
  }) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `🎸 Nouveau concert de ${data.group_name} !`,
        template: 'new-concert-notification',
        context: {
          user_name: data.user_name,
          group_name: data.group_name,
          concert_name: data.concert_name,
          date: data.date,
          place: data.place,
          price: data.price,
          action_url: data.action_url,
        },
      });

      this.logger.log(`✅ Email nouveau concert envoyé à: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email nouveau concert: ${error.message}`);
      throw new Error('Erreur lors de l\'envoi de l\'email de nouveau concert');
    }
  }
}