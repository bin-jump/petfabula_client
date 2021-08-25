export type UploadImage = {
  uri: string;
  type: string;
  name: string;
};

export type DisplayImage = {
  id: number;
  url: string;
  width: number;
  height: number;
};

export type AlreadyDeleted = {
  id: number;
};
