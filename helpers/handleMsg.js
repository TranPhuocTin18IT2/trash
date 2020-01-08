const cfg = require('./config')
const timeout = 3000
const request = require('request-promise')
const handle_data = require("../handle_data");
const predict = require('../prediction')

const parseString = require("xml2js").parseString;
let apikey = "5e93b605b28ee0aae9b2d53f134d439b";
let cities = "danang";
let countries = "vn";
let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cities},${countries}&mode=xml&appid=${apikey}`;
//
let dictionary = handle_data.create_Dictionary()
let senderName = ''
let date = new Date();
var hour = Number(date.getHours());
var dateForecast = Number(date.getDate()) + 1;
var state; //trạng thái
var temperatureMin; //nhiệt độ
var temperatureMax;
var humidity; //độ ẩm
var now;
var forecast_j;
request(url, (err, response, data) => {
    parseString(data, { trim: true }, (err, result) => {
      let root = result.weatherdata;
      let forecast = Array.from(root.forecast[0].time).map(p => ({
        time: {
          from: p.$.from,
          to: p.$.to,
          state: p.symbol[0].$.name,
          temp: {
            min: p.temperature[0].$.min,
            max: p.temperature[0].$.max
          },
          humidity: {
            value: p.humidity[0].$.value,
            unit: p.humidity[0].$.unit
          },
          clouds: {
            value: p.clouds[0].$.value,
            all: p.clouds[0].$.all,
            unit: p.humidity[0].$.unit
          }
        }
      }));

      let template = {
        location: {
          city: root.location[0].name[0],
          country: root.location[0].country[0],
          coord: {
            latitude: root.location[0].location[0].$.latitude,
            longitude: root.location[0].location[0].$.longitude
          }
        },
        forecast: [forecast]
      };

      for (let forecast_i of root.forecast[0].time) {
        let hf = Number(forecast_i.$.from.substr(11, 2));
        let ht = Number(forecast_i.$.to.substr(11, 2));
        if (ht == 0) ht = 24;

        if (hour >= hf && hour <= ht) {
          state = forecast_i.clouds[0].$.value;
          temperatureMin = Number(forecast_i.temperature[0].$.min) - 273.15;
          temperatureMax = Number(forecast_i.temperature[0].$.max) - 273.15;
          temperatureMin = temperatureMin.toFixed(0);
          temperatureMax = temperatureMax.toFixed(0);
          humidity = forecast_i.humidity[0].$.value;
          now =
            "Thời tiết bây giờ \n" +
            "Sate: " +
            state +
            "\n" +
            "Temperature" +
            temperatureMin +
            "  " +
            temperatureMax +
            "\n" +
            "Humidity: " +
            humidity +
            "%";
          break;
        }
      }

      for (let forecast_i of root.forecast[0].time) {
        let date = Number(forecast_i.$.from.substr(8, 2));

        if (dateForecast == date) {
          state = forecast_i.clouds[0].$.value;
          temperatureMin = Number(forecast_i.temperature[0].$.min) - 273.15;
          temperatureMax = Number(forecast_i.temperature[0].$.max) - 273.15;
          temperatureMin = temperatureMin.toFixed(0);
          temperatureMax = temperatureMax.toFixed(0);
          humidity = forecast_i.humidity[0].$.value;
          forecast_j =
            "thời tiết dự báo ngày mai \n" +
            "Sate: " +
            state +
            "\n" +
            "Temperature" +
            temperatureMin +
            "  " +
            temperatureMax +
            "\n" +
            "Humidity: " +
            humidity +
            "%";
          break;
        }
      }
    });
    // console.log(now + forecast_j);
  });
let lsWords = new Array()
let handle_text = (text) =>{
    let clean_text = handle_data.clean_string(text)
    let tolowercase = clean_text.toLowerCase()
    lsWords = tolowercase.split(' ')
    return lsWords
}
//check
let check = (msg) => {
  handle_text(msg)
  for(let i in lsWords){
      for(let j in dictionary){
          if(dictionary.indexOf(lsWords[i]) === -1){
              lsWords.splice(i,1)
          }else{
              break
          }
      }
  }
  if(lsWords.length<1){
      return false
  }
  return true
}
module.exports.handleMessage = (sender_psid, receivedMsg)=>{
    let response 
    if(receivedMsg.text){
        console.log(check(receivedMsg.text))
                if(check(receivedMsg.text) == true){
                    console.log(lsWords)
                    tfjs_AI(lsWords, sender_psid)
                }
                else {
                    response = {text: 'Tôi không hiểu bạn đang nói gì'}
                    // callSendAPI(sender_psid, response)
                }
        }else if(receivedMsg.attachments){
        let attachment_url = receivedMsg.attachments[0].payload.url
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
                // callSendAPI(sender_psid, response)
            }
    // Send the response message
    callSendAPI(sender_psid, response)
}
 // Handle postbacks
module.exports.handlePostback = (sender_psid, received_postback)=>{
    let response
    let payload = received_postback.payload
    switch (payload) {
        case 'GET_STARTED': {
            response = { "text": "Bắt đầu"}
            callSendAPI(sender_psid, response)
            break
        }
        case 'yes': {
            response = { "text": "Thanks" }
            callSendAPI(sender_psid, response)
            break
        }
        case 'no': {
            response = { "text": "Oops, try send another image" }
            callSendAPI(sender_psid, response)
            break
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
                    // console.log(response)
                    callSendAPI(sender_psid, response)
                }, timeout)
            })

            break
        }
        case 'NOT_GO_WILOKE': {
            response = { "text": "OK See you again" }
            callSendAPI(sender_psid, response)
            break
        }
    }
}
const callSendAPI = (sender_psid,response,cb=null)=>{
     // Construct the message body
    let request_body = {
        "recipient":{
            "id":sender_psid
        },
        "message":response
    }
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
                    cb()
                }
                console.log("message sent!")
            }else{
                console.error("Unable to send message"+err);
            }
        }
    );
};

const tfjs_AI = async (fbUserMsg,senderID) => {
    let result = await predict.predictions(fbUserMsg)
    await getSenderInformation(senderID, (senderInfo) => {
        senderName = senderInfo.first_name
    })
    await handleMsg(result, senderID)
}
let getSenderInformation = (senderID,cb) =>{
    return request(
      {
            url: `https://graph.facebook.com/v3.2/${senderID}`,
        qs: {
          access_token: cfg.PAGE_ACCESS_TOKEN,
          fields: "first_name"
        },
        method: "GET"
      },
      (err, response, body) => {
        if (!err) {
          return cb(JSON.parse(body))
        }
      }
    )
}

let handleMsg =(result,senderID) => {
    if(result=='greetings_0'){
        let response = {
            text: `Chào bạn ${senderName}, tôi có thể giúp gì cho bạn`
        }
        callSendAPI(senderID, response)
        return
    }
    if(result == 'greetings_1'){
        let response = {
            text: 'tạm biệt'
        }
        callSendAPI(senderID, response)
        return
    }
    if(result=='weather'){
        let response = {
            text: now+"\n"+forecast_j
        }
        callSendAPI(senderID, response)
        return
    }
    if (result == "regards") {
        let response = {
            text: 'Tôi rất vui vì có thể giúp bạn.'
        }
        callSendAPI(senderID, response)
        return
    }
    if (result == "recommendations") {
        let response = {
            text: `Trời hôm nay đẹp lắm ${senderName}`
        }
        callSendAPI(senderID, response)
        return
    }
    if(result == "swearing") {
        let response = {
            text: `${senderName}, vui lòng không nói tục `
        }
        callSendAPI(senderID, response)
        return
    }
}