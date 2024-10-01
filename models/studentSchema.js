const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  feeSubmission:{type: String, enum: ['submitted', 'unsubmitted'],default:"unsubmitted"},
  progressCheck:[
    {
      course:{type:mongoose.Schema.Types.ObjectId , ref:"Course"},
      percentage: {
        type: Number, // Use Number type for numeric values
        default: 0,   // Default value if not provided
      },
    }
  ]
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;