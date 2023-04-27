var DynamoDB = require("aws-sdk/clients/dynamodb");
const send = require("../send");
var documentClient = new DynamoDB.DocumentClient({
  region: "ap-south-1",
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const CERTIFICATE_TABLE_NAME = "certificateTable";

module.exports.certificate = async (event, context, cntxt) => {
  let Id = event.pathParameters.certificateId;
  try {
    const params = {
      TableName: CERTIFICATE_TABLE_NAME,
      Key: {
        certificateId: Id,
      },
      // ConditionExpression: 'attribute_exists(Id)'
    };
    await documentClient.delete(params).promise();
    cntxt(null, send.statement(200, Id));
  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};
