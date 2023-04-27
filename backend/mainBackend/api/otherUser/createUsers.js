var aws = require("aws-sdk");
const send = require("../send.js");
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
const TABLE_NAME = "otherUsers";

module.exports.otherUsers = async (event, context, cntxt) => {
  let data = JSON.parse(event.body);
  const emailparams = {
    Destination: {
      ToAddresses: [
        "vasanthagokulsadhanandham@gmail.com",
        "ksulaxman@gmail.com",
      ],
    },
    Message: {
      Body: {
        Text: {
          Data:
            "A new user has been signed-up the details are below. \nOfficial Mail ID: " +
            data.mail +
            ". \nName: " +
            data.fname +
            " " +
            data.lname +
            ".",
        },
      },
      Subject: { Data: "New user Signed-up" },
    },
    Source: "harisudhanv24@gmail.com",
  };

  const Emailparams = {
    EmailAddress: data.mail,
  };

  const params = {
    TableName: TABLE_NAME,
    Item: {
      mail: data.mail,
      sl: data.sl,
      sbu: data.sbu,
      fname: data.fname,
      lname: data.lname,
    },
    ConditionExpression: "attribute_not_exists(mail)",
  };

  try {
    await ses.verifyEmailIdentity(Emailparams).promise();
    await documentClient.put(params).promise();
    await ses.sendEmail(emailparams).promise();

    cntxt(null, send.statement(200, data.mail));
  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};
