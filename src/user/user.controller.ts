import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserOutputDto } from './dto/user-base.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ImageValidationInterceptor } from 'src/common/interceptors/file-validation.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'), new ImageValidationInterceptor())
  create(@Body() CreateUserDto: CreateUserDto) {
    const user = this.userService.create(CreateUserDto);
    return plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.findById(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('image'), new ImageValidationInterceptor())
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Uploading avatar for user:', id);
    return this.userService.uploadAvatar(id, file);
  }
}
