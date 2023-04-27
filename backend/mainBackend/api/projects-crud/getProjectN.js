var aws = require("aws-sdk");
var ses = new aws.SES({ region: "ap-south-1" });
const { Client } = require("pg");
const RDS_HOST = "ecap.c0w0mlh1iicy.ap-south-1.rds.amazonaws.com";
const RDS_PORT = "5432";
const RDS_USERNAME = "postgres";
const RDS_PASSWORD = "admin123";
const RDS_DB_NAME = "postgres";

module.exports.project = async (event, context, cntxt) => {
  let name = event["queryStringParameters"]["name"];
  const client = new Client({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
  });
  await client.connect();
  const query = "select * from  projectstable where projectname=$1";
  const parameters = [name];
  try {
    let data = [];
    const result = await client.query(query, parameters);
    data = data.concat(result.rows);
    const objects = data.map((item) => {
      return {
        projectname: item.projectname,
        des: item.des,
        skill: item.skill,
        exper: item.exper,
        dateto: item.dateto,
        datefrom: item.datefrom,
        status: item.status,
        assigned: item.assigned,
      };
    });
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(objects),
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
