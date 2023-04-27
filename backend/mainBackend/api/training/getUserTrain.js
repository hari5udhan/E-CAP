const { Client } = require("pg");
const send = require("../send");

const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

module.exports.file = async (event, context, cntxt) => {
  const client = new Client({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
  });

  await client.connect();
  try {
    let username = event["queryStringParameters"]["username"];
    const query = "SELECT * from trainingtable WHERE mail= $1";
    const parameters = [username];
    let data = [];
    const result = await client.query(query, parameters);
    data = data.concat(result.rows);
    await client.end();
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      "Access-Control-Allow-Credentials": true,
    };
    context.succeed({
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    });
  } catch (error) {
    await client.end();
    cntxt(null, send.statement(500, error.message));
  }
};
