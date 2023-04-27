var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('./send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const REQUEST_TABLE_NAME = "deleteRequestedTable";

module.exports.certificate= async(event, context, cntxt)=>{
    try{
        const params={
            TableName: REQUEST_TABLE_NAME,
        };
        let data = await documentClient.scan(params).promise();
        cntxt(null, send.statement(200, data));
    }catch(err){
        cntxt(null, send.statement(500, err.message));
    }
}