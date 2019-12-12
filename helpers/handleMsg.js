const cfg = require('./config');
const timeout = 3000;
const request = require('request');
const models = require('../models/msg')
// connect to atlas mongodb
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbSICT:TCQ18it2it@messagese-stkxp.mongodb.net/chatbot?retryWrites=true&w=majority";
const collection = client.db('chatbot').collection('messages')

const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
module.exports.handleMessage = (sender_psid , receivedMsg)=>{
    let response ;
    if(receivedMsg.text){
        console.log(receivedMsg.text);
        // mesageWitAI(receivedMsg.text,sender_psid);
            response = {"text": `You sent the message: "${receivedMsg.text}". Now send me an image!`}
            if(collection.findOne({text:receivedMsg.text})){
                console.log('This record already exists!')
            }else{
                collection.insertOne(models(receivedMsg.text,type)) // insert data
            }
    }else if(receivedMsg.attachments){
        let attachment_url = receivedMsg.attachments[0].payload.url;
/*message : */
     response = {
                // Get the URL of the message attachment
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Is this the right picture?",
                "subtitle": "Tap a button to answer.",
                "image_url": attachment_url,
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Yes!",
                    "payload": "yes",
                  },
                  {
                    "type": "postback",
                    "title": "No!",
                    "payload": "no",
                  }
                ],
              }]
            }
          }
        }
    }
    // Send the response message
    callSendAPI(sender_psid, response);
};
 // Handle postbacks
module.exports.handlePostback = (sender_psid , received_postback)=>{
    let response;
    let payload = received_postback.payload;
    switch (payload) {
        case 'GET_STARTED': {
            response = { "text": "Bắt đầu"};
            break;
        }
        case 'yes': {
            response = { "text": "Thanks" };
            callSendAPI(sender_psid, response);
            break;
        }
        case 'no': {
            response = { "text": "Oops, try send another image" }
            callSendAPI(sender_psid, response);
            break;
        }
        case 'GO_WILOKE': {
            response = {
                "text": "https://listgo.wiloke.com"
            }
            callSendAPI(sender_psid, response, () => {
                setTimeout(() => {
                    response = {
                        "attachment": {
                            "type": "image",
                            "payload": {
                                "url": "https://i0.wp.com/listgo.wiloke.com/wp-content/uploads/2017/07/2.jpg?resize=740%2C740&ssl=1",
                                "is_reusable": true
                            }
                        }
                    }
                    console.log(response)
                    callSendAPI(sender_psid, response)
                }, timeout);
            });

            break;
        }
        case 'NOT_GO_WILOKE': {
            response = { "text": "OK See you again" }
            callSendAPI(sender_psid, response);
            break;
        }
    }
};
const callSendAPI = (sender_psid,response,cb=null)=>{
     // Construct the message body
    let request_body = {
        "recipient":{
            "id":sender_psid
        },
        "message":response
    };
       // Send the HTTP request to the Messenger Platform
    request(
        {
            "uri":"https://graph.facebook.com/v2.6/me/messages",
            "qs":{"access_token":cfg.PAGE_ACCESS_TOKEN},
            "method":"POST",
            "json":request_body

        },
        (err,res,body)=>{
            if(!err){
                if(cb){
                    cb();
                }
                console.log("message sent!");
            }else{
                console.error("Unable to send message"+err);
            }
        }
    );
};
