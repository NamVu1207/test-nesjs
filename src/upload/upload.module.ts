import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { uploader, UploaderSchema } from './schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: uploader.name, schema: UploaderSchema },
    ]),
    CloudinaryModule,
  ],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
