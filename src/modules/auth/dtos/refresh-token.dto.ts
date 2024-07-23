import * as Zod from 'zod';

import { createZodDto } from '@anatine/zod-nestjs';

export const RefreshTokenValidator = Zod.object({
  refreshToken: Zod.string(),
});

export class RefreshTokenDto extends createZodDto(RefreshTokenValidator) {}
