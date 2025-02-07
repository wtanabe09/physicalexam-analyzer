import { fetchAuthSession } from 'aws-amplify/auth';
import { FetchMethodType } from '../../exports/types';

const getPresignedUrl = process.env.REACT_APP_API_GET_PRESIGNED_URL;

export const getTimestamp = () => {
  const today = new Date();
  const ymd = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('');

  const time = [
    String(today.getHours()).padStart(2, '0'),
    String(today.getMinutes()).padStart(2, '0'),
    String(today.getSeconds()).padStart(2, '0')
  ].join('');

  return `${ymd}T${time}`;
};

export const fetchPresignedUrl = async (
  methodType: FetchMethodType, extension: string, idToken: string,
  selectedUserNum: string | null, selectedTechnique: string,
  timestamp: string, mediaType: string,
): Promise<string | null> => {
  try {
    console.log("Fetching presigned URL for", methodType, extension, timestamp);
    const res = await fetch(`${getPresignedUrl}?requestType=${methodType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken
      },
      body: JSON.stringify({
        userNum: selectedUserNum,
        techniqueId: selectedTechnique,
        timestamp: timestamp,
        extension: extension,
        mediaType: mediaType,
      }),
    });

    if (!res.ok) throw new Error(`Failed to get presigned URL: ${res.statusText}`);

    const { presigned_url } = await res.json();
    return presigned_url;
  } catch (error) {
    console.error("Error fetching presigned URL:", error);
    return null;
  }
};


// "get", "put" メソッドで使用
export const fetchFileFromS3 = async (presignedUrl: string): Promise<Blob | null> => {
  try {
    console.log("Fetching file from S3:", presignedUrl);
    const fetchResponse = await fetch(presignedUrl, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    });

    if (!fetchResponse.ok) throw new Error(`Failed to fetch file: ${fetchResponse.statusText}`);

    return await fetchResponse.blob();
  } catch (error) {
    console.error("Error fetching file from S3:", error);
    return null;
  }
};

export const uploadFileToS3 = async (presignedUrl: string, file: Blob): Promise<Response | null> => {
  try {
    console.log("Uploading file to S3:", presignedUrl);
    const fetchResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!fetchResponse.ok) throw new Error(`Failed to upload file: ${fetchResponse.statusText}`);

    return fetchResponse;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return null;
  }
};

export const fetchObjectKeys = async (extension: string, techniqueId?: string) => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    console.log("### start: fetch object keys ### ", extension, techniqueId);
    const res = await fetch(`${getPresignedUrl}?requestType=get-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken!
      },
      body: JSON.stringify({
        techniqueId: techniqueId,
        extension: extension
      }),
    });

    if (!res.ok) throw new Error("Failed to fetch object keys");
    const { keys } = await res.json();
    console.log("### done: fetch object keys ### ");
    return keys as Promise<string[]>
  } catch (error) {
    console.error(error);
  }
}

