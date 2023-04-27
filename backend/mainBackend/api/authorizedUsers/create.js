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
const { Client } = require("pg");

const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

const TABLE_NAME = "otherUsers";

module.exports.employee = async (event, context, cntxt) => {
  let data = JSON.parse(event.body);
  console.log(data);
  let mail = data.mail;
  const client = new Client({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
  });
  let course = [];
  let skill = [];
  let skillgap = ["iaas", "paas", "saas"];
  skill.push(data.skill);
  await client.connect();
  const Iquery =
    "INSERT INTO employeetable (mail, sl, sbu, fname, lname, approvedskill, courses, skillgap,unapprovedskill,designation,certificates,completedprojects, uncompletedprojects,task) SELECT $1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12,$13,$14 WHERE NOT EXISTS (SELECT 1 FROM employeetable WHERE mail = $1);";
  const Iparameters = [
    data.mail,
    data.sl,
    data.sbu,
    data.fname,
    data.lname,
    skill,
    course,
    skillgap,
    "NULL",
    "NULL",
    course,
    course,
    course,
    course,
  ];

  const deleteParams = {
    TableName: TABLE_NAME,
    Key: {
      mail: mail,
    },
  };

  try {
    const queryResults = await client.query(Iquery, Iparameters);
    await documentClient.delete(deleteParams).promise();
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify("Successfully Added!"),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      },
    };
  } catch (err) {
    await client.end();

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
