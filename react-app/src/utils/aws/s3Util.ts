import { fetchAuthSession } from 'aws-amplify/auth';
import { FetchMethodType } from '../../exports/types';

const getPresignedUrl = process.env.REACT_APP_API_GET_PRESIGNED_URL;

export const getTimestamp = () => {
  const today = new Date();
  const ymd = today.toLocaleDateString("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replaceAll("/", "");
  const time = today.toLocaleTimeString("ja-JP", {hour12: false}).replaceAll(":", "");
  return ymd + "T" + time;
}

// "get", "put" メソッドで使用
export const fetchBlob = async (
  methodType: FetchMethodType, idToken: string,
  blob: Blob | null, selectedUser: string, selectedTechnique: string,
  timestamp: string, mediaType: string, extension: string
) => {
  try {
    console.log("get presigned url: " + timestamp);
    // Presigned url 取得
    const res = await fetch(`${getPresignedUrl}?requestType=${methodType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken
      },
      body: JSON.stringify({
        sub: selectedUser,
        techniqueId: selectedTechnique,
        timestamp: timestamp,
        extention: extension,
        mediaType: mediaType,
      }),
    });
    const { presigned_url } = await res.json();

    console.log("fetch by presigned url: " + presigned_url);
    const fetchResponse = await fetch(presigned_url, {
      method: methodType,
      headers: {'Content-Type': blob? blob.type : 'application/json'},
      body: blob,
    })

    console.log("fetch object done: " + timestamp);
    return fetchResponse;
  } catch(error) {
    console.error(error);
  }
}

export const fetchObjectKeys = async (userSub: string) => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    console.log("### start: fetch object keys ### ");
    const res = await fetch(`${getPresignedUrl}?requestType=get-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken!
      },
      body: JSON.stringify({
        sub: userSub
      }),
    });
    const { keys } = await res.json();
    console.log(keys);
    console.log("### done: fetch object keys ### ");
    return keys as Promise<string[]>
  } catch (error) {
    console.error(error);
  }
}

