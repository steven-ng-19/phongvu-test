import { CreateWishValidator } from './create-wish.dto';
import { z } from 'zod';

export const EditWishValidator = CreateWishValidator.partial();

export type EditWishDto = z.infer<typeof EditWishValidator>;
