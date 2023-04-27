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
const TABLE_NAME = "employeeTable";
const USER_TABLE_NAME= "otherUsers";

module.exports.employee= async(event, context, cntxt)=>{
    let data= JSON.parse(event.body);
    try{
        const params={
            TableName: TABLE_NAME,
            Item:{
                employeeMail: data.employeeMail,
                employeeSl: data.employeeSl,
                employeeSbu: data.employeeSbu,
                employeeFname: data.employeeFname,
                employeeLname: data.employeeLname,

            },
            ConditionExpression: 'attribute_not_exists(employeeMail)',   
        };

        const deleteParams={
          TableName: USER_TABLE_NAME,
          Key:{
            'employeeMail': data.employeeMail
          }
        }
        
        await documentClient.put(params).promise();
        await documentClient.delete(deleteParams).promise();
        cntxt(null, send.statement(200, data.employeeMail));

    }catch(err){
        cntxt(null, send.statement(200, err.message));

    }
}