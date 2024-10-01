const mongoose = require('mongoose');

const studentAssignmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, default: Date.now },
  fileUrl: { type: String },
  
}, { timestamps: true });

const assignment = mongoose.model('studentAssignment', studentAssignmentSchema);
module.exports = assignment;