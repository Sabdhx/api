const userModel = require("../models/authModel.js");
const jwt = require("jsonwebtoken");
const adminSchema = require("../models/adminSchema.js")
const TeacherTracking = async (req, res, next) => {
  const { token } = req.cookies; // Get the token from cookies
  console.log(token);
  
  if (token) {
    jwt.verify(token, "secret", {}, async (err, usertoken) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" }); // Handle token error
      }

      const user = await adminSchema.findById(usertoken.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" }); // Handle user not found
      }  
      const { role } = user; // Destructure role from user object
       
      if (role === "admin") {
        return next(); // Call next() if the role is teacher
      } else {
        return res.status(403).json({ message: "Access denied. Not admin." }); // Handle access denial
      }
    });
  } else {
    return res.status(401).json({ message: "No token provided" }); // Handle no token case
  }
};

module.exports = { TeacherTracking };
