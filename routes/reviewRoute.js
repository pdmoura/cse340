const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/review-validation')

// Route to Add a new Review
router.post(
  "/add",
  utilities.checkLogin,
  regValidate.registationRules(), // 1. Rules
  regValidate.checkReviewData,    // 2. Check
  utilities.handleErrors(reviewController.addReview)
)

// Route to Deliver the Edit View
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
)

// Route to Process the Update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),      // 1. Rules
  regValidate.checkUpdateData,    // 2. Check
  utilities.handleErrors(reviewController.updateReview)
)

// Route to Deliver the Delete View
router.get(
  "/delete/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildDeleteReview)
)

// Route to Process the Delete
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router