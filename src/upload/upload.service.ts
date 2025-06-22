import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { uploader, UploaderDocument } from './schemas/file.schema';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(uploader.name)
    private readonly uploaderModel: Model<UploaderDocument>, // Replace 'any' with the actual type if available
    private readonly cloudinaryService: CloudinaryService, // Assuming CloudinaryService is injected here
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    folder: string = 'uploads',
    type: 'image' | 'video' | 'document' = 'image',
  ): Promise<{
    reused?: boolean;
    url?: string;
    publicId?: string;
  }> {
    try {
      const hash = this.generateHash(file.buffer);

      // Check if a file with the same hash and type already exists
      const existing = await this.uploaderModel.findOne({ hash, type });

      if (existing) {
        // ✅ Reuse file, don't re-upload
        return {
          reused: true,
          url: existing.url,
          publicId: existing.publicId,
        };
      }

      const result = await this.cloudinaryService.uploadFile(file, folder);

      const uploadRecord = new this.uploaderModel({
        userId: new Types.ObjectId(userId), // Assuming userId is a string
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: result.secure_url,
        publicId: result.public_id,
        type: type,
        hash: hash,
      });
      await uploadRecord.save();

      return {
        reused: false,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }

  private generateHash(buffer: Buffer): string {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  async deleteFileByPublicId(publicId: string): Promise<void> {
    await this.cloudinaryService.deleteFile(publicId);
    await this.uploaderModel.deleteOne({ publicId });
  }
}
