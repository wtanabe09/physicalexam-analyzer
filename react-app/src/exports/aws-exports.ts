const awsConfig = {
  "aws_project_region": process.env.REACT_APP_AWS_PROJECT_REGION,
  "aws_cognito_region": process.env.REACT_APP_AWS_COGNITO_REGION,
  "aws_user_pools_id": process.env.REACT_APP_AWS_COGNITO_USER_POOLS_ID,
  "aws_user_pools_web_client_id": process.env.REACT_APP_AWS_COGNITO_USER_POOLS_CLIENT_ID,
}

export default awsConfig;