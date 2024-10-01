const express = require("express");
const app = express();
const auth = require("./route/authRoute.js");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const courseUpload= require("./route/courseUplaoding.js")
const student = require("./route/studentRoute.js")
const dotenv = require('dotenv').config();




app.use(cors({
  origin: "http://localhost:5173",
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

  


mongoose.connect(process.env.mongoDB)
  .then(() => console.log("Database connected"))
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); 
  });

 



app.use("/auth", auth);
app.use("/course", courseUpload);
app.use("/studentWork", student)
 
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
