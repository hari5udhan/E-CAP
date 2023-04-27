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

module.exports.request = async (event, context, cntxt) => {
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
    Key: {
      mail: data.mail,
    },
  };

  await client.connect();
  const query =
    "update employeetable set approvedskill=array_append(approvedskill ,$1) where mail=$2";
  const parameters = [data.assignedSkill, data.mail];

  try {
    await client.query(query, parameters);
    await documentClient.delete(params).promise();
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify("Approved!"),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      },
    };
  }
};
