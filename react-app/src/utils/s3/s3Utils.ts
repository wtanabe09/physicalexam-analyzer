import { fetchAuthSession } from 'aws-amplify/auth';
import { FetchMethodType } from '../../exports/types';

const getPresignedUrl = process.env.REACT_APP_API_GET_PRESIGNED_URL;

export const fetchSessionData = async () => {
  const startSessionUrl = getPresignedUrl + "?requestType=start-session";
  const res = await fetch(startSessionUrl);
  const data = await res.json();
  return data;
}

// "get", "put" メソッドで使用
export const fetchBlob = async (
  methodType: FetchMethodType,
  blob: Blob | null, selectedUser: string, selectedTechnique: string,
  timestamp: string, sessionId: string, mediaType: string, extension: string
) => {
  const session = await fetchAuthSession();
  if (!session.tokens?.idToken) return;

  try {
    console.log("get presigned url: " + blob?.type);
    // Presigned url 取得
    const res = await fetch(`${getPresignedUrl}?requestType=${methodType.toLowerCase()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session.tokens?.idToken?.toString()
      },
      body: JSON.stringify({
        techniqueId: selectedTechnique,
        timestamp: timestamp,
        sessionId: sessionId,
        extention: extension,
        mediaType: mediaType,
      }),
    });
    const { presigned_url } = await res.json();

    console.log("fetch by presigned url: " + blob?.type);
    const fetchResponse = await fetch(presigned_url, {
      method: methodType,
      headers: {'Content-Type': blob? blob.type : 'application/json'},
      body: blob,
    })

    console.log("fetch object done: " + blob?.type);
    return fetchResponse;
  } catch(error) {
    console.error(error);
  }
}

export const fetchObjectKeys = async (userId: string) => {
  const session = await fetchAuthSession();
  if (!session.tokens?.idToken) return;
  try {
    console.log("### start fetch object keys ### " + session.tokens?.idToken?.toString());
    const res = await fetch(`${getPresignedUrl}?requestType=get-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session.tokens.idToken.toString()
      },
      body: JSON.stringify({
        userId: userId
      }),
    });
    const { keys } = await res.json();
    console.log("### done fetch ### ");
    return keys
  } catch (error) {
    console.error(error);
  }
}

// export const s3GetObjectById = async () => {
//   const PROVIDE_KEY = `cognito-idp.${awsConfig.aws_cognito_region}.amazonaws.com/${awsConfig.aws_user_pools_id}`;
//   const session = await fetchAuthSession();

//   try {
//     if (!session.tokens?.idToken) return;
    
//     const idCredential = fromCognitoIdentityPool({
//       identityPoolId: awsConfig.aws_identity_pools_id!,
//       clientConfig: {region: awsConfig.aws_cognito_region},
//       logins: {
//         [PROVIDE_KEY]: session.tokens?.idToken?.toString()
//       },
//     })

//     const client = new S3Client({
//       region: 'ap-northeast-3', 
//       credentials: idCredential // credential が表出する。取得して、別のAPIリクエストを作成されかねない。
//     })

//     const command = new GetObjectCommand({
//       Bucket: 'physicalexam-data',
//       Key: `us-east-1:6a132771-2348-c38d-7d55-ae2300f6ea54/test.png`, // ここのKeyがバレる
//     });
  
//     const res = await client.send(command);
//     console.log(res);
//   } catch(e) {
//     console.log(e);
//   }
// }