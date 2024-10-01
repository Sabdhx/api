const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const userModel = require('../models/authModel.js');
const jwt = require("jsonwebtoken")
const studentSchema = require("../models/studentSchema.js")
const adminModel = require("../models/adminSchema.js")
const customError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = customError;
const createUser = async (req, res, next) => {
  const { userName, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    let newUser = new studentSchema({
      userName,
      email,
      password: hashedPassword,
    
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};


 
const signIn = async (req, res, next) => {
  const { userName, password } = req.body;

  try {
    // Check if the user is an admin
    const adminUser = await adminModel.findOne({ userName });
    if (adminUser) {
      // Check password for admin
      const validPassword = await bcrypt.compare(password, adminUser.password);
      if (!validPassword) {
        return next(customError(401, "Incorrect username or password for admin")); 
      }
      
      // Generate JWT token for admin
      const token = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });

      // Set the token as a cookie
      res.cookie("token", token, {
        sameSite: "None",
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      
      // Return admin user data
      return res.status(200).json({
        userName: adminUser.userName,
        email: adminUser.email,
        role: 'admin',
        token,
      });
    }

    // Check if the user exists in the student schema
    const validUser = await studentSchema.findOne({ userName });
    if (!validUser) {
      return next(customError(401, "Incorrect username or password for student")); 
    }

    // Compare the password for the student
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(customError(401, "Incorrect username or password for student"));
    }

    // Exclude the hashed password from the response
    const { password: hashedPassword, ...userData } = validUser._doc;

    // Generate JWT token for student
    const token = jwt.sign({ id: validUser._id, role: 'student' }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });

    // Set the token as a cookie
    res.cookie("token", token, {
      sameSite: "None",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Return student user data (excluding password)
    res.status(200).json({
      ...userData, // Spread the user data excluding password
      token, // Optionally return the token if needed
      role: 'student',
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    next(customError(500, "An error occurred during sign in")); 
  }
};


 const userVerification = (req, res) => {
  const { token } = req.cookies;
  console.log(token)
  if (token) {
    jwt.verify(token,"secret", {}, async (err, usertoken) => {
      if (err) throw err;
      const { userName, email, _id} = await userModel.findById(
        usertoken.id
      );
      res.json({ userName, email, _id });
    });
  }
};

const userLogout= async(req,res)=>{
  res.clearCookie("token",{
    httpOnly:true,
    secure:true,
    sameSite:"none"
  })
  .send({message:"cookie cleared successfully"})
}

const allUsers=async(req,res)=>{
  const reponse = await adminModel.find()
  res.json(reponse)
}

const DeleteUser = async(req,res)=>{
  const id = req.params.id;
  const user = await studentSchema.findByIdAndDelete(id);
  res.json({message:"deleted"})
}

const studentFind=async(req,res)=>{
  const find = await studentSchema.find();
  res.status(200).json({message:find})
}

module.exports = {createUser,signIn,userVerification,userLogout,allUsers,DeleteUser,studentFind}