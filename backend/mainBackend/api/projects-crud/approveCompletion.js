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
    Key: {
      projectname: data.projectname,
    },
  };

  await client.connect();
  let none = [];
  let status = "Completed";
  const query1 = "update projectstable set status = $1 where projectname =$2";
  const parameters1 = [status, data.projectname];
  const query2 =
    "update employeetable set completedprojects= array_append(completedprojects, $1), uncompletedprojects=array_remove(uncompletedprojects, $1) where mail=$2";
  const parameters2 = [data.projectname, data.user];
  try {
    await client.query(query2, parameters2);
    await documentClient.delete(params).promise();
    await client.query(query1, parameters1);
    // console.log(data);
    // await ses.sendEmail(emailparams).promise();
    await client.end();

    // console.log(data);

    return {
      statusCode: 200,
      body: JSON.stringify("Approved!"),
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
