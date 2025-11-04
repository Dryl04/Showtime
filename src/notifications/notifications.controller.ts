import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post('send-concert-reminder')
    async sendConcertReminder(@Body() body: {
        user_id: string;
        concert_name: string;
        date: string;
        location?: string;
    }) {
        try {
            const notification = await this.notificationsService.sendConcertReminder(body);

            return {
                success: true,
                message: 'Rappel de concert envoyé',
                notification_id: notification._id
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('send-artist-event')
    async sendArtistEvent(@Body() body: {
        user_id: string;
        artist_name: string;
        event_type: string;
        event_details: string;
    }) {
        try {
            const notification = await this.notificationsService.sendArtistEvent(body);

            return {
                success: true,
                message: 'Notification artiste envoyée',
                notification_id: notification._id
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}