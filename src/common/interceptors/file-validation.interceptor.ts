import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ImageValidationInterceptor {
  constructor(
    private maxSize = 5 * 1024 * 1024,
    private allowedTypes = ['image/jpeg', 'image/png'],
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file: Express.Multer.File = request.file;
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds ${this.maxSize / 1024 / 1024} MB`,
      );
    }

    return next.handle();
  }
}
