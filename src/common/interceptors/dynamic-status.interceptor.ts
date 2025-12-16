import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { DYNAMIC_STATUS } from '../decorators/dynamic-status.decorator';

@Injectable()
export class DynamicStatusInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Obtener el status seteado por el controller (si existe)
    const status = this.reflector.get<number>(
      DYNAMIC_STATUS,
      context.getHandler(),
    );

    return next.handle().pipe(
      tap(() => {
        if (status) {
          const res = context.switchToHttp().getResponse();
          res.status(status); // Establecemos el status HTTP
        }
      })
    );
  }
}
