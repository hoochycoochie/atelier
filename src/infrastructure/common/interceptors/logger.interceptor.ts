import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../../logger/logger.service';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();

    const ip = this.getIP(request);

    this.logger.log(
      `Incoming Request on ${request.url}`,
      `method=${request.method} ip=${ip}`,
    );

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `End Request for ${request.url}`,
          `method=${request.method} ip=${ip} duration=${Date.now() - now}ms`,
        );
      }),
    );
  }

  private getIP(request: Request): string {
    let ip: string;
    const ipAddr = request.headers['x-forwarded-for'];
    if (ipAddr) {
      ip = ipAddr[ipAddr.length - 1];
    } else {
      ip = request.socket.remoteAddress;
    }
    return ip.replace('::ffff:', '');
  }
}
