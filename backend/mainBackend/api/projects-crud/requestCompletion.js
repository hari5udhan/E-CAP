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

const TABLE_NAME = "projectCompletion";

const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

module.exports.project = async (event, context, cntxt) => {
  // const mail= event.pathParameters.mail;
  let data = JSON.parse(event.body);
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
      projectname: data.projectname,
      user: data.mail,
    },
    ConditionExpression: "attribute_not_exists(projectname)",
  };

  //   const emailparams={
  //     Destination: {
  //         ToAddresses: ["harisudhanv24@gmail.com"],
  //       },
  //       Message: {
  //         Body: {
  //           Text: { Data: "A user has requested for skill approval details are below. \nOfficial Mail ID: "+data.mail +". \nName: "+ data.fname+" "+data.lname+" \nSBU: "+ data.sbu+"    SL:"+data.sl+"\n"+"\n"+"The above user requested for skill apporoval of skill "+ data.skill+ " with courses of "+ data.coursesArray+"."},
  //         },
  //         Subject: { Data: "Skill approval- request" },
  //       },
  //       Source: "harisudhanv24@gmail.com",
  // };

  await client.connect();
  let status = "Requested For Completion";
  const query1 = "update projectstable set status = $1 where projectname =$2";
  const parameters1 = [status, data.projectname];

  try {
    await documentClient.put(params).promise();
    await client.query(query1, parameters1);
    // await ses.sendEmail(emailparams).promise();
    await client.end();

    // console.log(data);

    return {
      statusCode: 200,
      body: JSON.stringify("Requested!"),
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
