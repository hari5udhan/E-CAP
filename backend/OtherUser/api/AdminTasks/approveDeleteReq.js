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
const CERTIFICATE_TABLE_NAME = "certificateTable";
const REQUEST_TABLE_NAME = "deleteRequestedTable";
var ses = new aws.SES({region: 'ap-south-1'});


module.exports.certificate=async(event, context,cntxt)=>{
    let Id= event.pathParameters.certificateId;
    let username=  event["queryStringParameters"]["username"];
    const emailparams={
      Destination: {
          ToAddresses: [username],
        },
        Message: {
          Body: {
            Text: { Data: "Your certification Id: " + Id + ", has been deleted successfully." },
          },
          Subject: { Data: "Certification Deleted" },
        },
        Source: "harisudhanv24@gmail.com",
  };  
    try{
        const params={
            RequestItems:{
            [REQUEST_TABLE_NAME]:[{
                DeleteRequest:{
                    Key:{
                        'certificateId':Id
                    }     
                }
            }],
            [CERTIFICATE_TABLE_NAME]:[{
                DeleteRequest:{
                    Key:{
                        'certificateId':Id
                    }        
                }
            }],
          },
        ConditionExpression: 'attribute_exists(Id)'

        };
        await documentClient.batchWrite(params).promise();
        await ses.sendEmail(emailparams).promise();
        cntxt(null, send.statement(200, Id));

    }
    catch(err){
        cntxt(null, send.statement(500, err.message));
    }
}