import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly uploadService: UploadService, // Assuming CloudinaryService is injected here
  ) {}

  async create(
    createUserDto: CreateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    try {
      console.log('Creating user with data:', createUserDto);

      // check user exist
      const existing = await this.userModel.findOne({
        username: createUserDto.username,
      });
      if (existing) throw new ConflictException('user already exists');

      // check email exists
      await this.checkEmailNotTaken(createUserDto.email);

      // hash password
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      // create new user
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashPassword,
        avatar: null,
      });

      if (file) {
        const newAvatar = await this.handleAvatarUpload(
          createdUser._id.toString(),
          file,
        );
        createdUser.avatar = newAvatar;
      }

      return await createdUser.save();
    } catch (error) {
      console.error('🔥 Mongo error:', error.message);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async checkEmailNotTaken(email: string): Promise<void> {
    const existing = await this.userModel.findOne({ email: email }).lean();
    if (existing) throw new ConflictException('Email already exists');
  }

  findById(userId: string) {
    const user = this.userModel.findById(userId);
    if (!user) throw new BadRequestException('user not found!');
    return user;
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username: username }).exec();
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const newAvatar = await this.handleAvatarUpload(userId, file);
    if (!newAvatar) {
      throw new BadRequestException('Failed to upload avatar');
    }
    user.avatar = newAvatar;
    return user.save();
  }

  private async handleAvatarUpload(
    userId: string,
    file: Express.Multer.File,
  ): Promise<any> {
    const upload = await this.uploadService.uploadFile(
      file,
      userId,
      'user-avatars',
      'image',
    );
    console.log('Avatar upload result:', upload);

    return upload.url;
  }
}
