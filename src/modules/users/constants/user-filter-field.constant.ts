export const USER_FILTER_FIELD: (
  | 'id'
  | 'email'
  | 'clerkId'
  | 'customerId'
  | 'dob'
  | 'firstName'
  | 'lastName'
  | 'userName'
  | 'phone'
  | 'gender'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'avatar'
  | 'cover'
  | 'role'
)[] = [
  'id',
  'email',
  'clerkId',
  'customerId',
  'dob',
  'firstName',
  'lastName',
  'userName',
  'phone',
  'gender',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'avatar',
  'cover',
  'role',
];

export const USER_RELATION_FILTER_FIELD = [
  'addresses.country',
  'addresses.city',
];
