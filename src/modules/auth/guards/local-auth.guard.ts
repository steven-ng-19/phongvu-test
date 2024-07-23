import { AuthGuard } from '@nestjs/passport';
import { LOCAL_STRATEGY } from '../strategies';

export class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY) {}
