import { ACCESS_STRATEGY } from '../strategies';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class JwtAuthGuard extends AuthGuard(ACCESS_STRATEGY) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
