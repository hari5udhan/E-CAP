const statement =(statusCode, data)=>{
    return{
      statusCode,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'PUT, POST, DELETE, GET, OPTIONS',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json'
      },
    };
  }
const TRAINING_TABLE_NAME = "trainingDownload";
const statement1 =(statusCode, data, headers)=>{
  return{
    statusCode,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'PUT, POST, DELETE, GET, OPTIONS',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=${TRAINING_TABLE_NAME}.csv`

    },
  }
}

  const getUserName =(headers)=>{
    console.log(headers.appUserName)
    return headers.appUserName;  
  }
 

  module.exports={
    statement,
    getUserName,
    statement1
  }

  