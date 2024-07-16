import { AuthGuard } from '@nestjs/passport';
import { LOCAL_STRATEGY } from '../strategies/local.strategy';

export class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY) {}
