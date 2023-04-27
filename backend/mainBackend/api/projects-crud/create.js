const { Client } = require("pg");
const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";
module.exports.project = async (event, context, cntxt) => {
  let data = JSON.parse(event.body);
  console.log(data);
  const client = new Client({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
  });
  let user = [];
  let status = "Created";
  await client.connect();
  const query =
    "insert into projectstable (projectname, des, skill, exper, datefrom, dateto, status,assigned) select $1,$2,$3,$4,$5,$6,$7,$8 where not exists (select  1 from projectstable where projectname= $1)";
  const parameters = [
    data.name,
    data.des,
    data.skill,
    data.exp,
    data.start,
    data.end,
    status,
    user,
  ];

  try {
    await client.query(query, parameters);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify("Successfully Created!"),
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
