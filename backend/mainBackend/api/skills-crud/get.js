const { Pool } = require("pg");

const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

module.exports.skill = async (event, context, cntxt) => {
  const client = new Pool({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
  });

  await client.connect();
  const query = "select * from coursestable;";
  const parameters = ["skills"];

  try {
    let data = [];
    const result = await client.query(query);
    data = data.concat(result.rows);
    const skill = { skills: data.map((item) => item.skills) };
    // await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    await client.end();

    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      },
    };
  }
};
