const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const csv = require('csv-stringify');
const TRAINING_TABLE_NAME = "trainingDownload";
const json2csv = require('json2csv').parse;

module.exports.training = async (event, context) => {
  const tableName = TRAINING_TABLE_NAME;
  const scanParams = {
    TableName: tableName
  };
  let items = [];
  let lastKey;

  do {
    if (lastKey) {
      scanParams.ExclusiveStartKey = lastKey;
    }
    const data = await dynamo.scan(scanParams).promise();
    items = items.concat(data.Items);
    lastKey = data.LastEvaluatedKey;
  } while (lastKey);

  if(items.length === 0) {
    //Return 'Null' if there are no items
    const headers = {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'PUT, POST, DELETE, GET, OPTIONS',
      'Access-Control-Allow-Credentials': true
    };
    context.succeed({
      statusCode: 200,
      headers,
      body: 'Null'
    });
  }
  else {
    const csvData = json2csv(items);

    const deletePromises = items.map(item => {
      const deleteParams = {
        TableName: TRAINING_TABLE_NAME,
        Key: {
          username: item.username
        }
      };
      return dynamo.delete(deleteParams).promise();
    });
    await Promise.all(deletePromises);

    const headers = {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=${TRAINING_TABLE_NAME}.csv`,
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'PUT, POST, DELETE, GET, OPTIONS',
      'Access-Control-Allow-Credentials': true,
    };
    context.succeed({
      statusCode: 200,
      headers,
      body: csvData
    });
  }
};
