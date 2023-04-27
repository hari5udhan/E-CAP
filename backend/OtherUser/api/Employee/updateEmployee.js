var aws = require('aws-sdk');
var DynamoDB = require("aws-sdk/clients/dynamodb");
const send= require('../send');
var documentClient= new DynamoDB.DocumentClient({
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions:{
    timeout: 50000,
  },
});
const TABLE_NAME = "employeeTable";

module.exports.employee= async(event, context, cntxt)=>{
    let data= JSON.parse(event.body);
    try{
      let employeeMail= event.pathParameters.employeeMail;

      console.log(data.employeeSbu);
        const params={
            TableName: TABLE_NAME,
            Key: { employeeMail },
            UpdateExpression: 'set #employeeSl = :employeeSl, #employeeSbu = :employeeSbu, #employeeFname = :employeeFname, #employeeLname = :employeeLname',
            ExpressionAttributeNames:{
                '#employeeSl' : 'employeeSl',
                '#employeeSbu' : 'employeeSbu',
                '#employeeFname': 'employeeFname',
                '#employeeLname': 'employeeLname'
              },
              ExpressionAttributeValues:{
                ':employeeSl': data.employeeSl,
                ':employeeSbu': data.employeeSbu,
                ':employeeFname': data.employeeFname,
                ':employeeLname': data.employeeLname
              },
              
            ConditionExpression: 'attribute_exists(employeeMail)',   
        };

       
        await documentClient.update(params).promise();
        cntxt(null, send.statement(200, employeeMail));

    }catch(err){
        cntxt(null, send.statement(200, err.message));

    }
}