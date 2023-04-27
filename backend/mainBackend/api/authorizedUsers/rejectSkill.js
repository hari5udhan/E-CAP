var DynamoDB = require("aws-sdk/clients/dynamodb");
var documentClient = new DynamoDB.DocumentClient({
  region: "ap-south-1",
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const TABLE_NAME = "skillApproval";

module.exports.request = async (event, context, cntxt) => {
  let mail = event.pathParameters.mail;
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        mail: mail,
      },
    };

    await documentClient.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify("Rejected!"),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      },
    };
  }
};
