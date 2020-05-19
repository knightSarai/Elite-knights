const express = require("express");
const dotenv = require("dotenv");

// Routs files
const trainingcamps = require("./routs/trainingcamps");

// load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

// Mount routers
app.use("/api/v1/trainingcamps", trainingcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
