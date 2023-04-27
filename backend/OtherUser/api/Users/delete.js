var aws = require('aws-sdk');
var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('../send');
var ses = new aws.SES({region: 'ap-south-1'});
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const USER_TABLE_NAME= "otherUsers";
module.exports.user= async(event, context, cntxt)=>{
    let Id= event.pathParameters.userMail;

    try{
        const deleteParams={
            TableName: USER_TABLE_NAME,
            Key:{
              'employeeMail': Id
            }
          }

    await documentClient.delete(deleteParams).promise();
    cntxt(null, send.statement(200, Id));
    }

    catch(err){
      cntxt(null, send.statement(500, err));
    }
}