import { Module } from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import { ServiceCategoryController } from './service-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceCategory,
  ServiceCategorySchema,
} from './schemas/service-category.schema';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceCategory.name, schema: ServiceCategorySchema },
    ]),
    UploadModule
  ],
  providers: [ServiceCategoryService],
  controllers: [ServiceCategoryController],
})
export class ServiceCategoryModule {}
