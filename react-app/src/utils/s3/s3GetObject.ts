import { GetObjectCommand, GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";

// const getCurrentObject = (objectList: any[]) => {
//   // S3のオブジェクト一覧うち，最後に追加されたオブジェクトを選択する操作．
//   const sortedObject = [...objectList].sort((a, b) => b.LastModified - a.LastModified); // b-a 降順にソート
//   const currentObject = [...sortedObject][0]; // 最後に編集（追加）されたオブジェクト
//   return currentObject;
// }

// S3からビデオオブジェクト取得，Stateにオブジェクトセット
export const getS3Object = async (client: S3Client, bucketName: string, fileName: string) => {
  try {
    console.log('get object filename', fileName);
    const s3GetCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    const object = await client.send(s3GetCommand);
    return object;
  } catch (error) {
    console.error("Error fetching S3 object:", error);
    return null;
  }
}

// S3から得たオブジェクトの動画をBlob形式に変換
export const changeObjectToBlob = async (object: GetObjectCommandOutput) => {
  try {
    const body = await object.Body!.transformToByteArray();
    return new Blob([body], { type: "application/octet-stream" });
  } catch (error) {
    console.error("Error converting S3 object to Blob:", error);
    return null;
  }
}