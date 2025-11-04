import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Render,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  @Render('register')
  getRegisterPage() {
    return {};
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      await this.authService.register(registerDto);
      return res.redirect('/auth/login');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Une erreur est survenue';
      console.error('Erreur inscription:', message);
      return res.status(HttpStatus.BAD_REQUEST).render('register', {
        message: 'Erreur : cet email est déjà utilisé ou invalide.',
      });
    }
  }

  @Get('login')
  @Render('login')
  getLoginPage() {
    return {};
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginDto);

      res.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      return res.redirect('/');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Une erreur est survenue';
      console.error('Erreur connexion:', message);
      return res.status(HttpStatus.UNAUTHORIZED).render('login', {
        message: 'Email ou mot de passe incorrect.',
      });
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response) {
  res.clearCookie('access_token');
  return res.redirect('/'); 
}   
}
