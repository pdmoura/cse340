// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


// Login Route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to get register page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)


// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


// Default route for account management
router.get(
  "/", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)

// Route to get the update account page
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdate))


// Process the update account request
router.post("/update/",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.accountUpdate)
)


// Route to get the update password page
router.post("/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.passwordUpdate)
)

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.logout));


module.exports = router;