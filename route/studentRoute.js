const express = require("express");
const router = express.Router();
const {studentUploadingAssignment,studentAssignments, progressChecking} = require("../controller/studentWork.js")
router.post("/StudentAssignment",studentUploadingAssignment )
router.get("/allStudentsAssignments",studentAssignments)
router.post("/progress",progressChecking)
module.exports = router;