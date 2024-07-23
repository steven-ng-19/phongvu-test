import { AuthGuard } from '@nestjs/passport';
import { USER_STRATEGY } from '../strategies';

export class UserJwtAccessGuard extends AuthGuard(USER_STRATEGY) {}
