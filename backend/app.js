// Import the express module
const express=require('express');
const cors = require("cors");
require("dotenv").config();

const app=express();

// Specify a port number for the server
const port=process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// import router modules here

// use router modules

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});