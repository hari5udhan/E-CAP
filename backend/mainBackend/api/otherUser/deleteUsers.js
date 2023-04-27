var aws = require("aws-sdk");
const send = require("../send.js");

const TABLE_NAME = "otherUsers";
var aws = require("aws-sdk");
var DynamoDB = require("aws-sdk/clients/dynamodb");

var ses = new aws.SES({ region: "ap-south-1" });
var documentClient = new DynamoDB.DocumentClient({
  region: "ap-south-1",
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
module.exports.otherUsers = async (event, context, cntxt) => {
  const mail = event.pathParameters.mail;
  const deleteParams = {
    TableName: TABLE_NAME,
    Key: {
      mail: mail,
    },
  };

  try {
    await documentClient.delete(deleteParams).promise();
    cntxt(null, send.statement(200, mail));
  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};
