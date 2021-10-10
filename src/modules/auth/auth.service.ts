import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './interface/user.interface';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrPhoneNumber(email);
    
    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(pass, user.password);

    if (valid) {
      return user;
    }

    return null;
  }

  async signIn(user: User): Promise<any> {
    const token = await this.generateToken(user.toObject());
    return { token };
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const newUser = await this.usersService.signUp(authCredentialsDto);
    const token = await this.generateToken(newUser.toObject());

    return { user: newUser, token }
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    await this.cacheManager.set(token, 1);
    return token;
  }

  async logout(req) {
    if (req?.headers?.authorization) {
      const token = req?.headers?.authorization?.replace('Bearer ', '');
      await this.cacheManager.del(token);
    }
    return { message: 'Removed token' };
  }
}
