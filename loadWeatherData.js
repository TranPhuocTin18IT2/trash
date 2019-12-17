
const request = require("request");
const parseString = require("xml2js").parseString;
const util = require("util");
const inspect = require("eyes").inspector({ maxLength: false });
let apikey = "5e93b605b28ee0aae9b2d53f134d439b";
let cities = "danang";
let countries = "vn";
let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cities},${countries}&mode=xml&appid=${apikey}`;
let date = new Date();
var hour = Number(date.getHours());
var dateForecast = Number(date.getDate()) + 1;
var state; //trạng thái
var temperatureMin; //nhiệt độ
var temperatureMax;
var humidity; //độ ẩm
var now;
var forecast_j;
let rq = () =>{
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
    console.log(now + forecast_j);
  });
  return now
}

module.exports.rq = rq


// const request = require("request");
// const parseString = require("xml2js").parseString;
// const util = require("util");
// const inspect = require("eyes").inspector({ maxLength: false });
// let apikey = "5e93b605b28ee0aae9b2d53f134d439b";
// let cities = "danang";
// let countries = "vn";
// let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cities},${countries}&mode=xml&appid=${apikey}`;
//  let root
//  let forecast 
//  let template = ""
//  let date  = new Date()
// request(url, (err, response, data) => {
//   // console.log(data.location);
//   parseString(data, { trim: true }, (err, result) => {
//     root = result.weatherdata;
//     // console.dir(JSON.stringify(root));
//     forecast = Array.from(root.forecast[0].time).map(p => ({
//       time: {
//         from: p.$.from,
//         to: p.$.to,
//         state: p.symbol[0].$.name,
//         temp: {
//           min: p.temperature[0].$.min,
//           max: p.temperature[0].$.max
//         },
//         humidity: {
//           value: p.humidity[0].$.value,
//           unit: p.humidity[0].$.unit
//         },
//         clouds: {
//           value: p.clouds[0].$.value,
//           all: p.clouds[0].$.all,
//           unit: p.humidity[0].$.unit
//         }
//       }
//     }));
//     // console.log(JSON.stringify(rs));
//     template = {
//       location: {
//         city: root.location[0].name[0],
//         country: root.location[0].country[0],
//         coord: {
//           latitude: root.location[0].location[0].$.latitude,
//           longitude: root.location[0].location[0].$.longitude
//         }
//       },
//       forecast: [forecast]
//     };
//     // console.log(inspect(template));
//     // console.log(root.forecast[0].time[7].clouds[0].$.value);
//   });
// });
