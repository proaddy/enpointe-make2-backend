const express = require("express");
require("dotenv").config();

const jobroute = require("./routes/jobRoutes");
const uploadroute = require("./routes/uploadRoutes");
const grouproute = require("./routes/groupRoute");

const app = express();
app.use(express.json());

app.use("/job", jobroute);
app.use("/upload", uploadroute);
app.use("/group", grouproute)

app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
});
