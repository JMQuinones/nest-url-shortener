import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // to add to the response we use pipe
    return next.handle().pipe(map((response) => {
      if (!response) {
        return { data: [] }
      }
      if (response.data && response.meta) {
        return { data: response.data, meta: response.meta }
      }
      return { data: response }
    }));
  }
}
