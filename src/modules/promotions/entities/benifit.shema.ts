import { Benifit, Discount, Gift } from '../models';

export type DiscountDocument = Discount & Document;
export type GiftDocument = Gift & Document;
export type BenifitDocument = Benifit & Document;
