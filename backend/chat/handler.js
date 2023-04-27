require('dotenv').config();
const send= require('./send');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports.chatbot = async (event,context,cntxt)=>{
  let prompts= event["queryStringParameters"]["prompt"];
  const response = await openai.createCompletion({
    model:"text-davinci-003",
    prompt: prompts,
    max_tokens: 1000,
    temperature: 0.5,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });

  console.log(response.data.choices[0])
  cntxt(null, send.statement(200,response.data.choices[0].text))
}

// Iam AWS certified Solutions Architect - Associate, suggest me next higher level certification to this in next higher level, just say the certification name

