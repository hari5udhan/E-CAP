var aws = require("aws-sdk");
var DynamoDB = require("aws-sdk/clients/dynamodb");
const send = require("../send");
var documentClient = new DynamoDB.DocumentClient({
  region: "ap-south-1",
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const REQUEST_TABLE_NAME = "deleteRequested";
var ses = new aws.SES({ region: "ap-south-1" });

module.exports.certificate = async (event, context, cntxt) => {
  let data = JSON.parse(event.body);
  console.log(data);
  const emailparams = {
    Destination: {
      ToAddresses: [data.userName],
    },
    Message: {
      Body: {
        Text: {
          Data:
            "Your certification Id: " +
            data.certificateId +
            ", has been requested for delete.",
        },
      },
      Subject: { Data: "Certification Deleted" },
    },
    Source: "harisudhanv24@gmail.com",
  };
  try {
    const params = {
      TableName: REQUEST_TABLE_NAME,
      Item: {
        certificateId: data.certificateId,
        userName: data.userName,
        certificationName: data.certificationName,
        certificationProvider: data.certificationProvider,
        certificationLevel: data.certificationLevel,
        dateOfCertification: data.dateOfCertification,
        dateOfExpiry: data.dateOfExpiry,
        validity: data.validity,
        reason: data.reasonForDeletion,
      },
      ConditionExpression: "attribute_not_exists(certificateId)",
    };
    // console.log(certificateId)
    await documentClient.put(params).promise();
    await ses.sendEmail(emailparams).promise();

    cntxt(null, send.statement(201, data));
  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};
