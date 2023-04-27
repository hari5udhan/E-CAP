const { Client } = require("pg");
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "ap-south-1" });
var DynamoDB = require("aws-sdk/clients/dynamodb");
var documentClient = new DynamoDB.DocumentClient({
  region: "ap-south-1",
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});

const TABLE_NAME = "skillApproval";
const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

module.exports.employee = async (event, context, cntxt) => {
  // const mail= event.pathParameters.mail;
  let data = JSON.parse(event.body);
  console.log(data);
  const client = new Client({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
  });

  const params = {
    TableName: TABLE_NAME,
    Item: {
      mail: data.mail,
      courses: data.courses,
      sbu: data.sbu,
      sl: data.sl,
      name: data.fname + data.lname,
      skill: data.skills,
    },
    ConditionExpression: "attribute_not_exists(mail)",
  };

  const emailparams = {
    Destination: {
      ToAddresses: ["harisudhanv24@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Data:
            "A user has requested for skill approval details are below. \nOfficial Mail ID: " +
            data.mail +
            ". \nName: " +
            data.fname +
            " " +
            data.lname +
            " \nSBU: " +
            data.sbu +
            "    SL:" +
            data.sl +
            "\n" +
            "\n" +
            "The above user requested for skill apporoval.",
        },
      },
      Subject: { Data: "Skill approval- request" },
    },
    Source: data.mail,
  };

  //   await client.connect();
  //   const query = "update employeetable set unapprovedskill = $1 where mail=$2";
  //   const parameters = [];

  try {
    await documentClient.put(params).promise();
    // await client.query(query, parameters);
    await ses.sendEmail(emailparams).promise();
    // await client.end();

    // console.log(data);

    return {
      statusCode: 200,
      body: JSON.stringify("Successfully updated!"),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      },
    };
  } catch (error) {
    await client.end();

    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      },
    };
  }
};
