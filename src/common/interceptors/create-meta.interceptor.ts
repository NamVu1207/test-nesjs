import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CreateMetaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || request.user?._id;

    if (request.body) {
      request.body.createdAt = new Date();
      if (userId) request.body.createdBy = userId;
    }

    return next.handle();
  }
}
