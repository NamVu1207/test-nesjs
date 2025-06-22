import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DeleteMetaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || request.user?._id;

    request.body = {
      deletedAt: new Date(),
      ...(userId && { deletedBy: userId }),
    };

    return next.handle();
  }
}
