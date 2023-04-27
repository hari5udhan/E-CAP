const { Client } = require("pg");
const send = require("../send");
const json2csv = require("json2csv").parse;

const RDS_HOST = "ecap.cuzxhyamabqg.ap-south-1.rds.amazonaws.com";
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

module.exports.file = async (event, context, cntxt) => {
  await client.connect();

  try {
    let date = JSON.parse(event.body);
    const rangeFrom = date.rangeFrom;
    const rangeTo = date.rangeTo;
    const query =
      "SELECT * FROM trainingtable WHERE datefrom BETWEEN $1 AND $2";
    const parameters = [rangeFrom, rangeTo];
    let data = [];
    const result = await client.query(query, parameters);
    data = data.concat(result.rows);
    const csvData = json2csv(data);
    const headers = {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=trainingTable.csv`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      "Access-Control-Allow-Credentials": true,
    };
    context.succeed({
      statusCode: 200,
      headers,
      body: csvData,
    });
  } catch (error) {
    await client.end();
    cntxt(null, send.statement(500, error.message));
  }
};
