const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // review_text is required and must be at least 5 chars
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Please provide a valid review (minimum 5 characters)."), // Error message
    
    // inv_id is required (hidden field)
    body("inv_id")
      .notEmpty()
      .isInt(),

    // account_id is required (hidden field)
    body("account_id")
      .notEmpty()
      .isInt(),
  ]
}

/* **********************************
 * Update Review Validation Rules
 * ********************************* */
validate.updateRules = () => {
    return [
      // review_text is required
      body("review_text")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage("Please provide a valid review (minimum 5 characters)."),
      
      // review_id is required (hidden field)
      body("review_id")
        .notEmpty()
        .isInt(),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id, review_text } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // Since this is the detail view, we need the inventory data to re-render it
    const invModel = require("../models/inventory-model")
    const reviewModel = require("../models/review-model")
    
    const data = await invModel.getInventoryById(inv_id)
    const grid = await utilities.buildVehicleDetail(data[0]) 
    const reviews = await reviewModel.getReviewsByInventoryId(inv_id) 

    const invName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`

    res.render("./inventory/vehicle", {
      title: invName,
      nav,
      grid,
      errors: errors,
      inv_id: inv_id,
      reviews: reviews, 
    })
    return
  }
  next()
}

/* ******************************
 * Check Update Data
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { review_id, review_text, review_date } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const reviewModel = require("../models/review-model")
      const reviewData = await reviewModel.getReviewById(review_id)
      
      res.render("review/edit-review", {
        title: `Edit Review`,
        nav,
        errors: errors,
        review_id: review_id,
        review_text: review_text,
        review_date: reviewData.review_date 
      })
      return
    }
    next()
  }
  
module.exports = validate