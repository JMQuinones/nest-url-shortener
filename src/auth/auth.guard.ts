import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private apiKey: string;
  constructor(private readonly configService: ConfigService) {} 

  onModuleInit() {
    this.apiKey = this.configService.getOrThrow<string>('apiKey');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const headerApiKey = request.headers['x-api-key']
    if (!headerApiKey || headerApiKey !== this.apiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return true;
  }
}
