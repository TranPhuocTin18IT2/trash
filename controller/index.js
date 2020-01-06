
const helper = require('../helpers/handleMsg');
const cfg = require('../helpers/config');
module.exports.index = (req,res)=>{
    res.send('Home page. Server running okay.');
}
// Adds support for GET requests to our 'webhook'
module.exports.getMessage = (req,res)=>{   
  // Your verify token. Should be a random string. 
  let VERIFY_TOKEN = cfg.VALIDATION_TOKEN ; 
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query['hub.challenge'];
  // Checks if a token and mode is in the query string of the request
  if(mode && token){
      // Checks the mode and token sent is correct
    if(mode === 'subscribe' && token === VERIFY_TOKEN){
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    }
    else{
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);   
    }
  }
}
// Creates the endpoint for our webhook 
module.exports.postMessage = (req,res)=>{
  let body = req.body ; 
  let webhook_event = "" ;
   // Checks this is an event from a page subscription
  if(body.object === "page"){
          // Iterates over each entry - there may be multiple if batched
    body.entry.forEach((entry) => {
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
      webhook_event = entry.messaging[0];
      let senderId = webhook_event.sender.id ; 
      if(webhook_event.message){
        console.log(senderId)
        helper.handleMessage(senderId,webhook_event.message);
      }
      else if(webhook_event.postback) {
        helper.handlePostback(senderId,webhook_event.postback);
      }
    });
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
  }
  else {
      // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}