import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const user = await this.usersService.create(name, email, password);
    const userId = (user as any)._id.toString();

    const payload = { sub: userId, email: user.email, roles: user.roles };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const userId = (user as any)._id.toString();
    const payload = { sub: userId, email: user.email, roles: user.roles };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
