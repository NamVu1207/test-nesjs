import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
  ) {}

  async Register(userInfo): Promise<any> {
    try {
      console.log('Registering user with data:', userInfo);
      return await this.userService.create(userInfo);
    } catch (error) {
      throw new UnauthorizedException('Registration failed!');
    }
  }

  async signIn(
    username: string,
    password: string,
    res: Response,
  ): Promise<any> {
    try {
      const user = await this.userService.findByUsername(username);
      if (!user) throw new UnauthorizedException('user not found!');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Incorrect password!');

      const payload = { sub: user._id, username: user.username };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '3d',
      });

      await this.redisClient.set(
        `refreshToken:${user._id}`,
        refreshToken,
        'EX',
        259200,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return {
        access_token: accessToken,
        user: {
          id: user._id,
          email: user.username,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('login fail!');
    }
  }

  async logout(user: any, accessToken: string): Promise<void> {
    try {
      await this.redisClient.del(`refreshToken:${user.sub}`);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const ttl = user.exp - currentTime; // Calculate TTL from the token's exp and iat
      if (ttl > 0) {
        await this.redisClient.set(
          `blacklist:${accessToken}`,
          'blacklisted',
          'EX',
          ttl,
        );
      }
    } catch (error) {
      throw new UnauthorizedException('logout fail!');
    }
  }

  async getMe(userId: string): Promise<any> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) throw new UnauthorizedException('User not found');
      return user;
    } catch (error) {
      throw new UnauthorizedException('Failed to retrieve profile');
    }
  }
}
