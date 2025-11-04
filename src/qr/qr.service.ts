import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  
  async generateQRCode(data: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H', 
        type: 'image/png',
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return qrCodeDataURL;
    } catch (error) {
      throw new Error(`Erreur lors de la génération du QR code: ${error.message}`);
    }
  }

  
  generateTicketUrl(bookingId: string, baseUrl: string = 'http://localhost:3000'): string {
    return `${baseUrl}/bookings/${bookingId}/ticket`;
  }
}
