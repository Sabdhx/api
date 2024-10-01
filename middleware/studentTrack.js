const jwt = require("jsonwebtoken");
const studentSchema = require("../models/studentSchema.js")
const StudentTracking = async (req, res, next) => {
  const { token } = req.cookies; // Get the token from cookies
  console.log(token);
  
  if (token) {
    jwt.verify(token, "secret", {}, async (err, usertoken) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" }); // Handle token error
      }

      const user = await studentSchema.findById(usertoken.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" }); // Handle user not found
      }  
       // Destructure role from user object
       
      return next();
    });
  } else {
    return res.status(401).json({ message: "No token provided" }); // Handle no token case
  }
};

module.exports = { StudentTracking };
