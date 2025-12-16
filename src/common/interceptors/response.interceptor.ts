import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
     console.log('🚀 Request recibido');
    return next.handle().pipe(
      map((response) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        return {
          message: response?.message || 'Operación exitosa',
          data: response?.data ?? response,
          status: true,
          code: statusCode,
        };
      }),
    );
  }
}
