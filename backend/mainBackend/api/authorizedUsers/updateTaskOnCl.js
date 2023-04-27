const { Client } = require("pg");
const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

module.exports.employee = async (event, context, cntxt) => {
  let data = JSON.parse(event.body);
  const client = new Client({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
  });

  await client.connect();
  const rmQuery =
    "update employeetable set skillgap  = array_remove(skillgap, $2) where mail= $1";
  const rmParameters = [data.mail, data.skill];

  const query =
    "update employeetable  set task= array_append(task, $1), courses=array_append(courses, $3)  where mail=$2";
  const parameters = [data.task, data.mail, data.skill];

  const removeQ =
    "update employeetable  set task= array_remove(task, $1) where mail=$2";
  const removeP = [data.oldTask, data.mail];

  try {
    await client.query(removeQ, removeP);
    await client.query(rmQuery, rmParameters);
    await client.query(query, parameters);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify("Submited!"),
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
