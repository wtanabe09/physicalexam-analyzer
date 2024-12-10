import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ComboboxItem } from "@mantine/core";

// APIリクエストを送信して動画リストを取得
const accesskey = process.env.REACT_APP_AWS_ACCESS_KEY as string;
const secretaccesskey = process.env.REACT_APP_AWS_SECRET_KEY as string;
// const region = process.env.REACT_APP_AWS_REGION as string;
// export const baseBucket = process.env.REACT_APP_DATA_BUCKET_NAME as string;

// // TEST用 OSAKA region
const region = process.env.REACT_APP_TEST_AWS_REGION as string;
export const baseBucket = process.env.REACT_APP_TEST_DATA_BUCKET_NAME as string;

export const videoBucketName = `${baseBucket}-mp4`;
export const csvBucketName = `${baseBucket}-csv`;

export const createS3Client = () => {
  return new S3Client({
    region: region,
    credentials: {
      accessKeyId: accesskey,
      secretAccessKey: secretaccesskey,
    },
  });
}

// 実装課題：Lambdaを介したファイルアップロードに変更したい．
export const uploadBlobToS3 = async (blob: Blob, filename: string) => {
  const fileExtention = filename.split(".")[1]; // csv or mp4
  const dataBucket = baseBucket + "-" + fileExtention; // physicalexam-data-csv, physicalexam-data-mp4

  const client = createS3Client();

  try {
    console.log("upload start: " + filename);
    const res = await client.send(
      new PutObjectCommand({
        Bucket: dataBucket,
        Key: filename,
        Body: blob,
      })
    );
    console.log("upload done: " + filename, res);
  } catch(error) {
    console.log(error);
  }
}

export const formatWithPadding = (value: number | String) => String(value).padStart(2, '0');

export const getSessionFilename = (selectedUser: ComboboxItem, selectedTechnique: ComboboxItem) => {
  const userId = formatWithPadding(selectedUser.value);
  const techniqueId = formatWithPadding(selectedTechnique?.value);
  const dateTime = getFormattedDateTime();
  const fileName = `${userId}-${techniqueId}-${dateTime}`; // ex: 00-00-2024xxxx
  return fileName;
}

export const getFormattedDate = () => {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = formatWithPadding(now.getMonth() + 1)
  const date = formatWithPadding(now.getDate());
  return `${year}${month}${date}`;
}

export const getFormattedDateTime = () => {
  const now = new Date();
  const hours = formatWithPadding(now.getHours());
  const minutes = formatWithPadding(now.getMinutes());
  const seconds = formatWithPadding(now.getSeconds());
  return `${getFormattedDate()}${hours}${minutes}${seconds}`;
}