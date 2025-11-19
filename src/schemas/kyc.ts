import * as yup from "yup";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const kycUploadImage = yup.object().shape({
  kyc_img: yup
    .mixed<File>()
    .required("KYC image is required")
    .test("fileSize", "File size should not exceed 5MB", (value) => {
      if (!value) return true; // Let required handle empty values
      const file = value as File;
      return file.size <= 5 * 1024 * 1024; // 5MB in bytes
    })
    .test("fileType", "Only JPG, JPEG and PNG files are allowed", (value) => {
      if (!value) return true; // Let required handle empty values
      const file = value as File;
      return ALLOWED_FILE_TYPES.includes(file.type);
    })  ,
});
