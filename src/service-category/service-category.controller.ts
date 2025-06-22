import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationInterceptor } from 'src/common/interceptors/file-validation.interceptor';

@Controller('service-category')
export class ServiceCategoryController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('image'), new ImageValidationInterceptor())
  create(
    @Body() body: { name: string; description: string },
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.serviceCategoryService.create(body, image);
  }

  
}
