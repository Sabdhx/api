const courseModel = require("../models/courseModel.js");
const jwt = require("jsonwebtoken")
const studentSchema = require("../models/studentSchema.js")
const TeacherAssignmentSchema = require("../models/TeacherAssignmentSubmission.js")

const courseUploadingByTeacher = async (req, res) => {
  const { title, description, posts } = req.body; // 'students' is not needed since all students will be updated
  const token = req.cookies.token;

  try {
    if (token) {
      const verifiedToken = jwt.verify(token, "secret");

      // Create the new course
      const newCourse = await courseModel.create({
        title,
        description,
        posts,
        // You can add verifiedToken.id if you need to reference the teacher
      });

      // Add the new course to all students' progressCheck with default percentage
      const response = await studentSchema.updateMany(
        {}, // No filter, so it targets all students
        {
          $push: {
            progressCheck: { course: newCourse._id, percentage: 0 } // Add course ID with default percentage
          }
        }
      );
      res.status(201).json({ message: "progress added to the student schema" });
      res.status(201).json({ message: "Course uploaded and progress updated successfully" });
    } else {
      res.status(401).json({ message: "Please sign in first" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// const postInCourse = async (req, res) => {
//   try {
//     const { title, course, type, url } = req.body;

//     // Create a new post
//     const response = await posts.create({
//       title,
//       course,
//       type,
//       url
//     });
//   await courseModel.findByIdAndUpdate(course , {$push : {response}})
//   res.status(200).json(response)
//     // Return the created post
//     res.status(201).json(response);
//   } catch (error) {
//     console.error('Error creating post:', error);

//     // Handle specific errors (e.g., duplicate keys)
//     if (error.code === 11000) {
//       return res.status(409).json({ message: 'Post with this title already exists.' });
//     }

//     // General error response
//     res.status(500).json({ message: 'An error occurred while creating the post.', error: error.message });
//   }
// };

const deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;

    // Find and delete the course by ID
    const response = await courseModel.findByIdAndDelete(id);

    // Check if the course was found and deleted
    if (!response) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Respond with success message
    res.status(200).json({ message: "The course has been deleted successfully" });
  } catch (error) {
    console.error('Error deleting course:', error);

    // General error response
    res.status(500).json({ message: "An error occurred while deleting the course", error: error.message });
  }
};


const AllCourses = async (req, res) => {
  const course = await courseModel.find();
  res.status(200).json(course)
}

const feeSubmission = async (req, res) => {
  try {
    const { student } = req.body;

    // Check if student ID is provided
    if (!student) {
      return res.status(400).json({ message: 'Student ID is required.' });
    }

    // Update the feeSubmission status to "submitted"
    const updatedStudent = await studentSchema.findByIdAndUpdate(
      student,
      { feeSubmission: "submitted" },
      { new: true } // Return the updated document
    );

    // Check if the student was found and updated
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Successfully updated
    res.status(200).json({
      message: 'Fee submitted successfully.',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Error updating fee submission:', error);

    // Handle specific error cases
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid student ID format.' });
    }

    // General error response
    res.status(500).json({ message: 'An error occurred while submitting the fee.', error: error.message });
  }
};


const uploadingPostsOnly = async (req, res) => {
  const { course, title, type, url } = req.body;

  // Create a new post object
  const newPost = {
    title,
    type,
    url
  };

  try {
    // Find the course by ID and push the new post to the 'posts' array
    const response = await courseModel.findByIdAndUpdate(
      course, // Use the course ID directly, not { course }
      { $push: { posts: newPost } }, // Push the new post object
      { new: true } // Return the updated document
    );

    // Send the updated course as a response
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error uploading post" });
  }
};


const assignmentUploading = async (req, res) => {

  const { title, description, fileUrl } = req.body;
  const response = await TeacherAssignmentSchema.create(
    req.body
  )
  res.status(200).json(response)
}
 

const allAssignments=async(req,res)=>{
  const response = await TeacherAssignmentSchema.find();
  res.status(200).json(response)
}

const progressUpdation = async (req, res) => {
  const { student, course, percentage } = req.body;

  try {
    // Find the student by ID
    const response = await studentSchema.findById(student);

    if (response) {
      // Update the specific course's percentage within progressCheck array
      const updation = await studentSchema.updateOne(
        { _id: student, 'progressCheck.course': course }, // Match student and specific course
        { $set: { 'progressCheck.$.percentage': percentage } } // Update the percentage
      );

      res.status(200).json({ message: "Progress updated successfully", updation });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};



module.exports = { assignmentUploading,progressUpdation, courseUploadingByTeacher, feeSubmission, AllCourses, deleteCourse, uploadingPostsOnly,allAssignments };
