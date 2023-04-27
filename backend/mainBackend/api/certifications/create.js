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
const CERTIFICATE_TABLE_NAME = "certificateTable";
var ses = new aws.SES({ region: "ap-south-1" });

module.exports.certificate = async (event, context, cntxt) => {
  let data = JSON.parse(event.body);
  const emailparams = {
    Destination: {
      ToAddresses: [data.userName],
    },
    Message: {
      Body: {
        Text: {
          Data:
            "Your certificate: " +
            data.certificateId +
            ", has been added successfully.",
        },
      },
      Subject: { Data: "Certification added" },
    },
    Source: "harisudhanv24@gmail.com",
  };
  try {
    const params = {
      TableName: CERTIFICATE_TABLE_NAME,
      Item: {
        certificateId: data.certificateId,
        userName: data.userName,
        certificationName: data.certificationName,
        certificationProvider: data.certificationProvider,
        certificationLevel: data.certificationLevel,
        dateOfCertification: data.dateOfCertification,
        dateOfExpiry: data.dateOfExpiry,
        validity: data.validity,
        sbu: data.sbu,
        sl: data.sl,
      },
      ConditionExpression: "attribute_not_exists(certificateId)",
    };
    await documentClient.put(params).promise();
    await ses.sendEmail(emailparams).promise();
    cntxt(null, send.statement(201, data));
  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};
