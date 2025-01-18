
const getPresignedUrl = process.env.REACT_APP_API_GET_PRESIGNED_URL;

export const fetchSessionData = async () => {
  const startSessionUrl = getPresignedUrl + "?requestType=start-session";
  const res = await fetch(startSessionUrl);
  const data = await res.json();
  return data;
}

// "get", "put" メソッドで使用
export const fetchBlob = async (
  methodType: string, // get or put
  blob: Blob | null, selectedUser: string, selectedTechnique: string,
  timestamp: string, sessionId: string, mediaType: string, extension: string
) => {
  const fetchUrl = getPresignedUrl + `?requestType=${methodType.toLowerCase()}`; // get or put

  try {
    // Presigned url を取得
    const res = await fetch(fetchUrl, {
      method: 'POST',
      body: JSON.stringify({
        userId: selectedUser,
        techniqueId: selectedTechnique,
        timestamp: timestamp,
        sessionId: sessionId,
        extention: extension,
        mediaType: mediaType,
      }),
    });
    const { presigned_url } = await res.json();

    // Presigned url に対してfetch
    if (methodType === 'GET' || (methodType === 'PUT' && blob != null)) {

      const fetchResponse = await fetch(presigned_url, {
        method: methodType,
        body: blob,
        headers: {'Content-Type': blob? blob.type : 'application/json'}
      })
      console.log("fetch object result" + fetchResponse);
      return fetchResponse;
    }
  } catch(error) {
    console.error(error);
  }
}

export const fetchObjectKeys = async (userId: string) => {
  const getObjectKeysUrl = getPresignedUrl + "?requestType=get-keys";
  const res = await fetch(getObjectKeysUrl, {
    method: 'POST',
    body: JSON.stringify({
      userId: userId
    }),
  });
  const { keys } = await res.json();
  return keys
}