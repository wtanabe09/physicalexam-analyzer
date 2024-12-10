import { _Object, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { baseBucket, createS3Client } from "./s3Utils";
import { useEffect, useState } from "react";

// オブジェクト名の一覧を取得
const getS3ObjectList = async (client: S3Client, backetName: string) => {
  try {
    const getListCommand = new ListObjectsCommand({ Bucket: backetName });
    const { Contents } = await client.send(getListCommand);
    return Contents || [];
  } catch (error) {
    console.error("Error fetching object list:", error);
    return [];
  }
}

export const useS3ObjectList = (target: string) => {
  const [objectList, setObjectList] = useState<_Object[]>();
  const extension = target.split(".")[1];
  useEffect(() => {
    if(!extension) return;
    const client = createS3Client();
    const bucketName = `${baseBucket}-${extension}`; //basebacket-mp4, basebacket-csv

    const fetchData = async () => {
      const data = await getS3ObjectList(client, bucketName);
      setObjectList(data);
    }
    fetchData();
  }, []);
  
  return { objectList }
}