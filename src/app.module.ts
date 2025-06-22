import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guard/auth.guard';
import { blacklistMiddleware } from './common/middleware/blacklist.middleware';
import { ServiceCategoryModule } from './service-category/service-category.module';
import { ServiceModule } from './service/service.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    
    RedisModule,
    UserModule,
    AuthModule,
    ServiceCategoryModule,
    ServiceModule,
    CloudinaryModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(blacklistMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
