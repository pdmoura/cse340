const utilities = require('../utilities/index');
const accountModel = require('../models/account-model');
const reviewModel = require("../models/review-model")
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav(req, res, next)
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav(req, res, next)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

// Hash the password
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword 
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}



/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav(req, res, next)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/* ****************************************
* Deliver Account Management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav(req, res, next)
  // 1. NEW: GET USER REVIEWS
  const reviews = await reviewModel.getReviewsByAccountId(res.locals.accountData.account_id)

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    reviews: reviews
  })
}


// Deliver the update account view
async function buildUpdate(req, res) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  // SECURITY CHECK: Ensure user is updating their own account (unless they are an Admin)
  const loggedInUserId = res.locals.accountData.account_id;
  const accountType = res.locals.accountData.account_type;

  if (account_id !== loggedInUserId && accountType !== 'Admin') {
    req.flash("notice", "You do not have permission to view or modify this account.");
    return res.redirect("/account/");
  }

  const accountData = await accountModel.getAccountById(account_id)
  if (accountData) {
    res.render("account/account-update", {
      title: "My Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id
    })
  } else {
    req.flash("notice", "Sorry, we could not find that account.")
    res.status(404).redirect("/account/")
  }
}


// Process the account update request
async function accountUpdate(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email} = req.body
  const account_id = parseInt(req.body.account_id)

  // SECURITY CHECK: Prevent users from bypassing hidden inputs to update others
  const loggedInUserId = res.locals.accountData.account_id;
  const accountType = res.locals.accountData.account_type;

  if (account_id !== loggedInUserId && accountType !== 'Admin') {
    req.flash("notice", "You do not have permission to modify this account.");
    return res.redirect("/account/");
  }

  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  
  if (updateResult) {
    // ONLY regenerate the JWT if the user is updating their *own* account. 
    // This prevents an Admin from accidentally assuming the identity of the user they are updating.
    if (account_id === loggedInUserId) {
      const updatedAccountData = await accountModel.getAccountById(account_id)
      delete updatedAccountData.account_password
      const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
    }

    req.flash("notice", "Your account was successfully updated.")
    res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/account-update", {
      title: "My Account",
      nav,
      errors: null,
      account_id: account_id,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email
    })
  }
}

// Process the password update request
async function passwordUpdate(req, res) {
  let nav = await utilities.getNav()
  const new_password = req.body.account_password
  const account_id = parseInt(req.body.account_id)

  // SECURITY CHECK: Verify logged-in user matches the submitted account ID
  const loggedInUserId = res.locals.accountData.account_id;
  const accountType = res.locals.accountData.account_type;

  if (account_id !== loggedInUserId && accountType !== 'Admin') {
    req.flash("notice", "You do not have permission to modify this account's password.");
    return res.redirect("/account/");
  }

  const accountData = await accountModel.getAccountById(account_id)
  if (accountData) {
    try {
      const hashedPassword = await bcrypt.hash(new_password, 10)
      const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
      if (updateResult) {
        req.flash("notice", "Your password was successfully updated.")
        res.status(201).redirect("/account/")
      } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/account-update", {
          title: "My Account",
          nav,
          errors: null,
          account_firstname: accountData.account_firstname, 
          account_lastname: accountData.account_lastname,   
          account_email: accountData.account_email,         
          account_id: accountData.account_id                
        })
      }
    } catch (error) {
      throw new Error('Access Forbidden: ' + error.message)
    }
  } else {
    req.flash("notice", "Sorry, we could not find that account.")
    res.status(404).redirect("/account/")
  }
}

async function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have successfully logged out.");
  res.redirect("/");
}




module.exports = { buildLogin, buildRegister,registerAccount, accountLogin, buildManagement, buildUpdate, accountUpdate, passwordUpdate, logout };