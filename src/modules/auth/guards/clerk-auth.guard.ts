import { CLERK_STRATEGY, USER_STRATEGY } from '../strategies';

import { AuthGuard } from '@nestjs/passport';

export class ClerkAuthGuard extends AuthGuard(CLERK_STRATEGY) {}
