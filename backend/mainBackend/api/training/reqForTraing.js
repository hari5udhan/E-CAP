var aws = require("aws-sdk");
var DynamoDB = require("aws-sdk/clients/dynamodb");
const send = require("../send.js");
var documentClient = new DynamoDB.DocumentClient({
  region: "ap-south-1",
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const TRAINING_TABLE_FOR_DOWNLOAD = "trainingDownload";
var ses = new aws.SES({ region: "ap-south-1" });
const admin = "harisudhanv24@gmail.com";
module.exports.training = async (event, context, cntxt) => {
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
            "You requested for" +
            data.certificationprovider +
            " " +
            data.certificationname +
            "-" +
            data.certificationlevel +
            "certification from " +
            data.datefrom +
            ".",
        },
      },
      Subject: { Data: "Requested for certification Training" },
    },
    Source: admin,
  };

  const paramsForDownload = {
    TableName: TRAINING_TABLE_FOR_DOWNLOAD,
    Item: {
      mail: data.userName,
      certificationname: data.certificationName,
      certificationprovider: data.certificationProvider,
      certificationlevel: data.certificationLevel,
      datefrom: data.dateFrom,
      dateto: data.dateTo,
      sbu: data.sbu,
      sl: data.sl,
      status: data.status,
    },
  };

  try {
    // await documentClient.put(params).promise();
    await documentClient.put(paramsForDownload).promise();

    await ses.sendEmail(emailparams).promise();

    cntxt(null, send.statement(201, data));
  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};
