const express = require("express");
const app = express();
const auth = require("./route/authRoute.js");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const courseUpload= require("./route/courseUplaoding.js")
const student = require("./route/studentRoute.js")

const PORT = process.env.PORT || 5000



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

  
const mongoDB="mongodb+srv://develper:123@cluster0.6e7f2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoDB)
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
