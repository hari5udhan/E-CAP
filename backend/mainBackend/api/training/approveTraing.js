var aws = require("aws-sdk");
var DynamoDB = require("aws-sdk/clients/dynamodb");
const send = require("../send.js");
const { Client } = require("pg");
var documentClient = new DynamoDB.DocumentClient({
  region: "ap-south-1",
  maxRetries: 3,
  httpOptions: {
    timeout: 50000,
  },
});
const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

const client = new Client({
  host: RDS_HOST,
  port: RDS_PORT,
  user: RDS_USERNAME,
  password: RDS_PASSWORD,
  database: RDS_DB_NAME,
});

const TRAINING_TABLE_FOR_DOWNLOAD = "trainingDownload";
var ses = new aws.SES({ region: "ap-south-1" });
const admin = "harisudhanv24@gmail.com";
module.exports.training = async (event, context, cntxt) => {
  let data = JSON.parse(event.body);
  let mail = data.mail;
  // console.log(data)
  const emailparams = {
    Destination: {
      ToAddresses: [mail],
    },
    Message: {
      Body: {
        Text: {
          Data:
            "You request for " +
            data.certificationprovider +
            " " +
            data.certificationname +
            "-" +
            data.certificationlevel +
            "certification from " +
            data.datefrom +
            "." +
            " Has been " +
            data.status +
            ".",
        },
      },
      Subject: { Data: "Training Request- status" },
    },
    Source: admin,
  };

  const deleteParams = {
    TableName: TRAINING_TABLE_FOR_DOWNLOAD,
    Key: {
      mail: mail,
    },
  };
  await client.connect();

  try {
    const from = new Date(data.datefrom);
    const fromDate = from.toISOString().slice(0, 10);
    const to = new Date(data.dateto);
    const toDate = to.toISOString().slice(0, 10);
    const query = `INSERT INTO trainingTable (dateto,sbu,certificationprovider,certificationname,sl,mail,certificationlevel,datefrom, status) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)`;
    const values = [
      to,
      data.sbu,
      data.certificationprovider,
      data.certificationname,
      data.sl,
      data.mail,
      data.certificationlevel,
      from,
      data.status,
    ];
    await client.query(query, values);
    await documentClient.delete(deleteParams).promise();
    await ses.sendEmail(emailparams).promise();
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "CSV data successfully imported to RDS PostgreSQL database!",
      }),
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
