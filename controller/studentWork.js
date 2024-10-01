const studentSchema = require("../models/studentSchema.js");
const studentAssignmentSchema = require("../models/studentAssignmetnSchema.js")
const jwt = require("jsonwebtoken");

const studentUploadingAssignment = async (req, res) => {
    const { student, title, description, fileUrl } = req.body;
    const token = req.cookies.token;
  
    try {
      if (token) {
        // Verify the token
        jwt.verify(token, "secret", {}, async (err, usertoken) => {
          if (err) {
            return res.status(403).json({ message: "Invalid token" }); // Handle token error
          }
          

  
        //   Create a new assignment entry in the database
          const response = await studentAssignmentSchema.create({
            student:usertoken.id,
            title,
            description,
            fileUrl,
          });
        
          // Respond with the created assignment data
          return res.status(200).json(response);
        });
      } else {
        // return res.status(401).json({ message: "No token provided" }); // Handle no token case
      }
    } catch (error) {
      // Handle errors and send a relevant response
      console.error("Error uploading assignment:", error); // Log the error for debugging
      return res.status(500).json({ message: "Error uploading assignment", error: error.message }); // Send a response with the error message
    }
  };



  const studentAssignments=async(req,res)=>{
    const response = await studentAssignmentSchema.find();
    res.status(200).json(response);
  }


  const progressChecking = async (req, res) => {
    const { course, percentage } = req.body; // Removed student since it's derived from the token
    const token = req.cookies.token;
  
    try {
      if (token) {
        // Verify the token
        jwt.verify(token, "secret", {}, async (err, usertoken) => {
          if (err) {
            return res.status(403).json({ message: "Invalid token" }); // Handle token error
          }
  
          // Proceed with the update only if the token is valid
          const response = await Student.findOneAndUpdate(
            { _id: usertoken.id }, // Assuming the student ID is stored in the token
            { 
              $push: {
                progressCheck: {
                  course: course,           // Push the new course ID
                  percentage: percentage     // Push the new percentage
                }
              }
            }, 
            { new: true } // Return the updated document
          );
  
          return res.status(200).json(response); // Send the updated document as response
        });
      } else {
        return res.status(401).json({ message: "No token provided" }); // Handle case where no token is found
      }
    } catch (error) {
      return res.status(500).json({ message: error.message }); // Handle errors
      }
  }


  module.exports = {studentUploadingAssignment,studentAssignments,progressChecking}