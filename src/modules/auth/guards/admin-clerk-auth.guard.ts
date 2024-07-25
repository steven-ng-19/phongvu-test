import { ADIM_CLERK_STRATEGY } from '../strategies';
import { AuthGuard } from '@nestjs/passport';

export class AdminClerkAuthGuard extends AuthGuard(ADIM_CLERK_STRATEGY) {}
