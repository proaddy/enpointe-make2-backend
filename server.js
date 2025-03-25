const express = require("express");
const cors = require('cors');
require("dotenv").config();

const jobroute = require("./routes/jobRoutes");
const uploadroute = require("./routes/uploadRoutes");
const grouproute = require("./routes/groupRoute");

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(__dirname + "/public", {
    index: false, 
    immutable: true, 
    cacheControl: true,
    maxAge: "30d"
}));

app.use("/job", jobroute);
app.use("/upload", uploadroute);
app.use("/group", grouproute)

app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
});
