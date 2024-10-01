const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  videosWatched: [{ type: String }],  // Array of watched video URLs or IDs
}, { timestamps: true });

const progress = mongoose.model('ProgressCheck', progressSchema);
module.exports = progress;