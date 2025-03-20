const express = require('express');
require('dotenv').config()
const pool = require('./models/db');

const app = express();

app.use('/', (req, res, next) => {
    console.log("Hello World");
});

app.listen(process.env.PORT, ()=> {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
});