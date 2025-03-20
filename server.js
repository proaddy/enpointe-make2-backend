const express = require('express');
require('dotenv').config()
const jobroute = require('./routes/jobRoutes')

const app = express();
app.use(express.json());

// app.use('/', (req, res, next) => {
//     console.log("Hello World");
//     next();
// });

app.use('/job', jobroute);

app.listen(process.env.PORT, ()=> {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
});