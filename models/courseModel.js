const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  posts:[{
    title: { type: String, }, 
    imageUrl: { type: String,  },  
    vedioUrl: { type: String, }, 
    fileUrl:{type:String, },  
    uploadedAt: { type: Date, default: Date.now } 
  }]
}, { timestamps: true });

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;