const express = require("express");
const { courseUploadingByTeacher,progressUpdation, feeSubmission,allAssignments, AllCourses,assignmentUploading ,deleteCourse,uploadingPostsOnly} = require("../controller/AdminWorks.js");
const {TeacherTracking}=require("../middleware/TeacherTrack.js")
const router = express.Router()

router.post("/create-course" ,TeacherTracking,courseUploadingByTeacher);
router.post("/submitFee",feeSubmission)
router.get("/courses",AllCourses)
router.delete("/deleteCoures/:id",deleteCourse)
router.post("/uploadingPostsOnly",uploadingPostsOnly)


router.post("/assignmentUpload", TeacherTracking,assignmentUploading)
router.get("/allAssignments", allAssignments)
router.post("/progressUpdation",progressUpdation)



module.exports = router;