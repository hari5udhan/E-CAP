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
            ", has been updated successfully.",
        },
      },
      Subject: { Data: "Certification updated" },
    },
    Source: "harisudhanv24@gmail.com",
  };
  try {
    let certificateId = event.pathParameters.certificateId;
    const params = {
      TableName: CERTIFICATE_TABLE_NAME,
      Key: { certificateId },
      UpdateExpression:
        "set  #validity= :validity, #dateOfCertification= :dateOfCertification, #userName= :userName ,#dateOfExpiry= :dateOfExpiry, #sbu= :sbu, #sl= :sl",
      ExpressionAttributeNames: {
        "#dateOfCertification": "dateOfCertification",
        "#dateOfExpiry": "dateOfExpiry",
        "#userName": "userName",
        "#validity": "validity",
        "#sbu": "sbu",
        "#sl": "sl",
      },
      ExpressionAttributeValues: {
        ":dateOfCertification": data.dateOfCertification,
        ":userName": data.userName,
        ":dateOfExpiry": data.dateOfExpiry,
        ":validity": data.validity,
        ":sbu": data.sbu,
        ":sl": data.sl,
      },
      ConditionExpression: "attribute_exists(certificateId)",
    };

    await documentClient.update(params).promise();
    await ses.sendEmail(emailparams).promise();
    cntxt(null, send.statement(200, data));
  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};
