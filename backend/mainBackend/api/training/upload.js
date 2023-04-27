var aws = require("aws-sdk");
const { Client } = require("pg");
var ses = new aws.SES({ region: "ap-south-1" });
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

client.connect();

module.exports.file = async (event, context, cntxt) => {
  try {
    const data = JSON.parse(event.body);
    for (const row of data) {
      const from = new Date(row.datefrom);
      const fromDate = from.toISOString().slice(0, 10);
      const to = new Date(row.dateto);
      const toDate = to.toISOString().slice(0, 10);
      const query = `INSERT INTO trainingTable (dateto,sbu,certificationprovider,certificationname,sl,mail,certificationlevel,datefrom, status) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)`;
      const values = [
        to,
        row.sbu,
        row.certificationprovider,
        row.certificationname,
        row.sl,
        row.mail,
        row.certificationlevel,
        from,
        row.status,
      ];
      const emailparams = {
        Destination: {
          ToAddresses: [row.mail],
        },
        Message: {
          Body: {
            Text: {
              Data:
                "Your certification training request for " +
                row.certificationprovider +
                "-" +
                row.certificationname +
                " has been aproved, you will recieve the credentials shortly!",
            },
          },
          Subject: {
            Data: "Training Request for" + row.certificationname + "- regards",
          },
        },
        Source: "harisudhanv24@gmail.com",
      };

      await client.query(query, values);
      await ses.sendEmail(emailparams).promise();
    }
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
