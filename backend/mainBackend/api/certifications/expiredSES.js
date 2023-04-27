var aws = require("aws-sdk");
var ses = new aws.SES({ region: "ap-south-1" });
const send = require("../send");
module.exports.certificate = async (event, context, cntxt) => {
  let username = event["queryStringParameters"]["username"];
  let certificateId = event["queryStringParameters"]["certificateId"];
  let certificationName = event["queryStringParameters"]["certificationName"];
  let certificationProvider =
    event["queryStringParameters"]["certificationProvider"];

  const emailparams = {
    Destination: {
      ToAddresses: [username],
    },
    Message: {
      Body: {
        Text: {
          Data:
            "This is an mail regarding your certification ID " +
            certificateId +
            " " +
            certificationProvider +
            "-" +
            certificationName +
            " which has been expired.",
        },
      },
      Subject: { Data: "Certification expired" },
    },
    Source: "harisudhanv24@gmail.com",
  };

  try {
    await ses.sendEmail(emailparams).promise();
    cntxt(null, send.statement(200, certificateId));
  } catch (err) {
    cntxt(null, send.statement(500, err.message));
  }
};
