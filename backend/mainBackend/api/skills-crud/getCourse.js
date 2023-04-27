const { Client } = require("pg");

const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

module.exports.skill = async (event, context, cntxt) => {
  const skills = event.pathParameters.skill;
  const client = new Client({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
  });

  await client.connect();
  const query = "select course from coursestable where skills = $1";
  const parameters = [skills];

  try {
    let data = [];
    const result = await client.query(query, parameters);
    data = data.concat(result.rows);
    const courses = { course: data.map((item) => item.course) };
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(courses),
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
