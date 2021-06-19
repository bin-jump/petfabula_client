export type UploadImage = null | {
  uri: string;
  type: string;
  name: string;
};

export type DisplayImage = null | {
  url: string;
  width: number;
  height: number;
};
