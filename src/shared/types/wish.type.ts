export type NotificationMethod = {
  email: boolean;
  sms: boolean;
  pushNotification: boolean;
};

export type NotificationCondition = {
  minPrice: number;
  maxPrice: number;
  hasPromotion: boolean;
  hasStock: boolean;
};
