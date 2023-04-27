var send = require('./send');
var AWS = require('aws-sdk');
const USER_POOL_ID ='ap-south-1_8b1hVzlL2';


module.exports.requested= (event,context,cntxt) => {
	var params = {
	  UserPoolId: USER_POOL_ID,
	  AttributesToGet: [
		'given_name',
		'family_name',
		'email',
	  ],
	};
	
	return new Promise((resolve, reject) => {
		var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
		cognitoidentityserviceprovider.listUsers(params, (err, data) => {
			if (err) {
				console.log(err);
                cntxt(null, send.statement(500, err));
				reject(err)
			}
			else {
				console.log("data", data);
                cntxt(null, send.statement(200, data));
				resolve(data);
			}
		})
	});
}