import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ServiceCategory,
  ServiceCategoryDocument,
} from './schemas/service-category.schema';
import { Model } from 'mongoose';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectModel(ServiceCategory.name)
    private readonly serviceCategoryModel: Model<ServiceCategoryDocument>,
    private readonly uploadService: UploadService, // Assuming UploadService is injected here
  ) {}

  async create(
    ServiceCategory,
    image?: Express.Multer.File,
  ): Promise<ServiceCategory> {
    try {
      // check service category exists
      const existing = await this.serviceCategoryModel.findOne({
        name: ServiceCategory.name,
      });

      if (existing) {
        throw new Error('Service category already exists');
      }

      // create new service category
      const createdServiceCategory = new this.serviceCategoryModel(
        ServiceCategory,
      );

      if (image) {
        // handle image upload
        const uploadedImage = await this.uploadService.uploadFile(
          image,
          createdServiceCategory._id.toString(),
          'service-category',
          'image',
        );
        createdServiceCategory.imageUrl = uploadedImage.url || '';
      }

      return await createdServiceCategory.save();
    } catch (error) {
      console.error('🔥 Mongo error:', error.message);
      throw error;
    }
  }
}
