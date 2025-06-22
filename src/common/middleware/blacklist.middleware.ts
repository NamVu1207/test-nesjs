import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';

@Injectable()
export class blacklistMiddleware implements NestMiddleware {
  constructor(@Inject('REDIS_CLIENT') private redisClient: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const blacklist =
      (await this.redisClient.get(`blacklist:${accessToken}`)) || undefined;
    if (blacklist === 'blacklisted') {
      throw new BadRequestException('Token is blacklisted');
    }
    next();
  }
}
