import { CACHE_MANAGER, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { IS_PUBLIC_KEY } from 'src/core/decorators/auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const { headers } = context.switchToHttp().getRequest();
    const token = headers?.authorization?.replace('Bearer ', '');
    const jwtValid = await super.canActivate(context);
    if (!token || !jwtValid) {
      return false;
    }

    const tokenExistsInCache = await this.cacheManager.get(token);

    if (tokenExistsInCache) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
