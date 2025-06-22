import { Inject, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: 'auto',
        folder: folder,
      };

      const uploadStream = this.cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId);
      console.log(`Image with public ID ${publicId} deleted successfully.`);
      return result;
    } catch (error) {
      console.log(`Error deleting image with public ID ${publicId}:`, error);
    }
  }
}
