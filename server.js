"use strict";

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const port = process.env.PORT||3002;
const app = express();
 require('./machine_learning/readData')
// console.log(rs)

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

require('./routes/index')(app);

app.listen(port,()=>{
    console.log('Listening on *: 3002');
});