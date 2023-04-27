const statement =(statusCode, data)=>{
    return{
      statusCode,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin':'*',
      },
    };
  }
  
 

  module.exports={
    statement,
  }

  