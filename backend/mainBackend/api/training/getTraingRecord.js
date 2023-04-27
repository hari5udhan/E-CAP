const { Client } = require("pg");
const send = require("../send.js");
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
  // await client.end();
  const query = "SELECT * FROM trainingTable";
  try {
    const result = await client.query(query);
    const data = JSON.stringify(result);
    await client.end();
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      "Access-Control-Allow-Credentials": true,
    };
    context.succeed({
      statusCode: 200,
      headers,
      body: data,
    });
  } catch (error) {
    await client.end();
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      "Access-Control-Allow-Credentials": true,
    };
    context.succeed({
      statusCode: 500,
      headers,
      body: JSON.stringify(error),
    });
  }
};
