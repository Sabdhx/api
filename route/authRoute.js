const express = require("express")
const { createUser, signIn, userVerification, userLogout, allUsers,DeleteUser, studentFind} = require("../controller/auth.js")

const router = express.Router();

router.post('/create-user',createUser)
router.post('/login',signIn)
router.get('/user',userVerification)
router.get('/logout',userLogout)
router.get("/allUsers", allUsers)
router.delete("/delete/:id", DeleteUser)
router.get("/students", studentFind)

module.exports = router

