import * as randomString from 'randomstring';

import slugify from 'slugify';

export const generateSlug = (name: string): string => {
  return `${slugify(name, {
    replacement: '-',
    lower: true,
    trim: true,
  })}-${randomString.generate(5)}`;
};
