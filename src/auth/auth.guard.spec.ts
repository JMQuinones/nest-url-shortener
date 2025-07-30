import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { create } from 'domain';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let configService: DeepMocked<ConfigService>
  beforeEach(() => {
    configService = createMock<ConfigService>()
    configService.getOrThrow.mockReturnValue('secret');
    authGuard = new AuthGuard(configService)
    authGuard.onModuleInit();
  });
  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });
  it('Should return true if the API key is valid', () => {
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-api-key': 'secret',
          },
        }),
      }),
    });
    const result = authGuard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  })
  it('Should throw an exception if the API key is not valid', () => {
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-api-key': '',
          },
        }),
      }),
    });
    const result = () => authGuard.canActivate(mockExecutionContext);
    expect(result).toThrow(UnauthorizedException);
  })

  it('Should throw an exception if the API key is not present', () => {
    const mockExecutionContext = createMock<ExecutionContext>();
    const result = () => authGuard.canActivate(mockExecutionContext);
    expect(result).toThrow(UnauthorizedException);
  })
});
