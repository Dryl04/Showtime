import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest pour ne pas lancer d'erreur si pas de token
  handleRequest(err: any, user: any) {
    // Si pas d'utilisateur ou erreur, retourner null au lieu de lancer une exception
    if (err || !user) {
      return null;
    }
    return user;
  }
}
