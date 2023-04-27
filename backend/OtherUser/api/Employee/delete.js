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
const userPoolId = 'ap-south-1_8b1hVzlL2';
const cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider({
  region: 'ap-south-1'
});

module.exports.employee= async(event, context, cntxt)=>{
    let Id= event.pathParameters.employeeMail;
    let username=  event["queryStringParameters"]["username"];
    const params={
      TableName: TABLE_NAME,
      Key:{
         'employeeMail':Id
      },
  };

  const cognitoParams={
    UserPoolId: userPoolId,
    Username: username
}
    try{
    
        await cognitoIdentityServiceProvider.adminDeleteUser(cognitoParams).promise();
        await documentClient.delete(params).promise();
        cntxt(null, send.statement(200, Id));

    }
    catch(err){
        cntxt(null, send.statement(500, err.message));
    }
}