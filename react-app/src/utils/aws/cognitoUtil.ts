import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";

const lambdaEndpoint = process.env.REACT_APP_API_GET_PRESIGNED_URL;

export const fetchUserAttr = async () => {
  const userAttr = await fetchUserAttributes();
  return userAttr
}

export const checkAndRegisterIdentityId = async () => {
  const currentUser = await fetchAuthSession();
  const sub = currentUser.userSub;
  const idToken = currentUser.tokens?.idToken?.toString();

  // 初回ログインチェック (DynamoDB に `sub` があるか)
  const checkResponse = await fetch(`${lambdaEndpoint}?requestType=check-user`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": idToken!
       },
      body: JSON.stringify({ sub: sub })
  });

  const { exists } = await checkResponse.json();
  if (exists) {
      console.log("ユーザー情報はすでに登録済み");
      return;
  }

  // 初回ログインなら Identity ID を取得して登録
  const registerResponse = await fetch(`${lambdaEndpoint}?requestType=register-identity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": idToken!,
      },
      body: JSON.stringify({ sub: sub })
  });

  const data = await registerResponse.json();
  console.log("Registered Identity", data);
};