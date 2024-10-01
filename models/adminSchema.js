const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin", enum: ["admin"], required: true },
    uploadedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Courses uploaded by admin
    progressUpdates: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        progress: { type: Number, default: 0 } // Percentage of course completed
      }
    ],
   
    assignments: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        dueDate: { type: Date, required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      }
    ]
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
