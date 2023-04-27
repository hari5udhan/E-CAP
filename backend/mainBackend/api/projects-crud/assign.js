var aws = require("aws-sdk");
var ses = new aws.SES({ region: "ap-south-1" });
const { Client } = require("pg");
const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

module.exports.project = async (event, context, cntxt) => {
  let data = JSON.parse(event.body);
  const client = new Client({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
  });
  await client.connect();
  let status = "Assigned";
  const query1 =
    "update projectstable set status = $1, assigned= $2 where projectname =$3";
  const parameters1 = [status, data.user, data.projectname];
  const query2 =
    "update employeetable set  uncompletedprojects= array_append(uncompletedprojects, $1) where mail= $2";
  const parameters2 = [data.projectname, data.user];

  const emailparams = {
    Destination: {
      ToAddresses: [data.user],
    },
    Message: {
      Body: {
        Text: {
          Data: "A project has been assigned to you please check your profile for more details.",
        },
      },
      Subject: { Data: "A new project" },
    },
    Source: "harisudhanv24@gmail.com",
  };

  try {
    await client.query(query1, parameters1);
    await client.query(query2, parameters2);
    await ses.sendEmail(emailparams);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify("Successfully Assigned!"),
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
