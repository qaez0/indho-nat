export interface IKycUploadImage {
  kyc_img: File;
}

export interface IStatusData {
  title: string;
  image: number; // require() returns number in React Native
  description: string;
}


export interface IKycUploadImageRequest {
  files: File,
  collection: string
}