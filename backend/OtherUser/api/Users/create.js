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

const send = require("../send");
const TABLE_NAME = "employeeTable";
const USER_TABLE_NAME = "otherUsers";

module.exports.user = async (event, context, cntxt) => {
  let data = JSON.parse(event.body);
  const emailparams = {
    Destination: {
      ToAddresses: [
        "harisudhanv24@gmail.com",
        "ksulaxman@gmail.com",
        "vasanthagokulsadhanandham@gmail.com",
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
  try {
    const params = {
      TableName: USER_TABLE_NAME,
      Item: {
        mail: data.mail,
        sl: data.sl,
        sbu: data.sbu,
        fname: data.fname,
        lname: data.lname,
      },
      ConditionExpression: "attribute_not_exists(mail)",
    };

    const Emailparams = {
      EmailAddress: data.mail,
    };

    await ses.verifyEmailIdentity(Emailparams).promise();
    await documentClient.put(params).promise();
    await ses.sendEmail(emailparams).promise();

    cntxt(null, send.statement(200, data.mail));
  } catch (err) {
    cntxt(null, send.statement(500, err));
  }
};
