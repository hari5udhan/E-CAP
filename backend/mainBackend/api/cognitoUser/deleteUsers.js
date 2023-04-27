const send = require("../send");
var AWS = require("aws-sdk");
const USER_POOL_ID = "ap-south-1_jSoVECzHK";
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
module.exports.cognito = async (event, context, cntxt) => {
  const username = event.pathParameters.username;
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };
  try {
    await cognitoidentityserviceprovider.adminDeleteUser(params).promise();
    cntxt(null, send.statement(200, username));
  } catch (error) {
    cntxt(null, send.statement(500, error.message));
  }
};
