import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from 'src/config/cloudinary.config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
