const mongoose = require('mongoose');

const TeacherAssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, default: Date.now },
  fileUrl: { type: String },
  
}, { timestamps: true });

const assignment = mongoose.model('TeacherAssignment', TeacherAssignmentSchema);
module.exports = assignment;