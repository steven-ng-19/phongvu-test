import { createHash } from 'crypto';

export const hexHash = (data: string): string => {
  return createHash('sha256').update(data).digest('hex');
};

export const base64Hash = (data: string): string => {
  return createHash('sha256').update(data).digest('base64');
};
