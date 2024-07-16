type PresignedUrlEntity = {
  key: string;
  type: string;
};

export type PresignedUrlsEntity = {
  urls: PresignedUrlEntity[];
};
