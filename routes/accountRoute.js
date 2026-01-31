// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")


// Login Route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to get register page
router.get("/register", utilities.handleErrors(accountController.buildRegister));




module.exports = router;