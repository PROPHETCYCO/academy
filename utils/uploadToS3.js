import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import dotenv from "dotenv";
dotenv.config();

export const uploadFileToS3 = async (file, folderName) => {
  const fileName = `${folderName}/${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};