"use strict";

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const port = process.env.PORT||3002;
const app = express();
const mongoose = require('mongoose')
const assert = require('assert')
const uri =
    "mongodb://dbSICT:sictK18@anonymous-shard-00-01-app1j.mongodb.net:27017/weather-chat-bot?ssl=true&replicaSet=anonymous-shard-0&authSource=admin"

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
//     assert.equal(null, err)
//     console.log('connected')
//     require('./generated_model')
// })
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

require('./routes/index')(app);

app.listen(port,()=>{
    console.log('Listening on *: 3002');
});
