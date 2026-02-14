const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ****************************************
 * Process Add Review
 * *************************************** */
reviewCont.addReview = async function (req, res) {
  const { review_text, inv_id, account_id } = req.body
  const result = await reviewModel.addReview(review_text, inv_id, account_id)
  
  if (result) {
    req.flash("notice", "Review added successfully.")
    req.session.save(function() {
        res.redirect(`/inv/detail/${inv_id}`)
    })
  } else {
    req.flash("notice", "Sorry, the review failed to add.")
    req.session.save(function() {
        res.redirect(`/inv/detail/${inv_id}`)
    })
  }
}

/* ****************************************
 * Deliver Edit Review View
 * *************************************** */
reviewCont.buildEditReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)
  
  // CHECAGEM DE SEGURANÇA: Garante que a avaliação pertence ao usuário logado
  const loggedInUserId = res.locals.accountData.account_id;
  if (!reviewData || reviewData.account_id !== loggedInUserId) {
    req.flash("notice", "You do not have permission to edit this review.");
    return res.redirect("/account/");
  }
  
  res.render("review/edit-review", {
    title: `Edit Review for ${reviewData.inv_make} ${reviewData.inv_model}`,
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    review_date: reviewData.review_date
  })
}

/* ****************************************
 * Process Update Review
 * *************************************** */
reviewCont.updateReview = async function (req, res) {
  const { review_id, review_text } = req.body

  // CHECAGEM DE SEGURANÇA: Puxa o dono original da avaliação no banco de dados
  const reviewData = await reviewModel.getReviewById(parseInt(review_id))
  const loggedInUserId = res.locals.accountData.account_id;

  if (!reviewData || reviewData.account_id !== loggedInUserId) {
    req.flash("notice", "You do not have permission to update this review.");
    return res.redirect("/account/");
  }

  const updateResult = await reviewModel.updateReview(review_id, review_text)

  if (updateResult) {
    req.flash("notice", "The review was successfully updated.")
    req.session.save(function() {
        res.redirect("/account/")
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    let nav = await utilities.getNav()
    
    res.status(501).render("review/edit-review", {
      title: "Edit Review",
      nav,
      errors: null,
      review_id: review_id,
      review_text: review_text,
      review_date: reviewData.review_date 
    })
  }
}


/* ****************************************
 * Deliver Delete Confirmation View
 * *************************************** */
reviewCont.buildDeleteReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)

  // CHECAGEM DE SEGURANÇA
  const loggedInUserId = res.locals.accountData.account_id;
  if (!reviewData || reviewData.account_id !== loggedInUserId) {
    req.flash("notice", "You do not have permission to delete this review.");
    return res.redirect("/account/");
  }

  res.render("review/delete-review", {
    title: "Delete Review",
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    review_date: reviewData.review_date,
    inv_make: reviewData.inv_make,
    inv_model: reviewData.inv_model
  })
}

/* ****************************************
 * Process Delete Review
 * *************************************** */
reviewCont.deleteReview = async function (req, res) {
  const { review_id } = req.body

  // CHECAGEM DE SEGURANÇA
  const reviewData = await reviewModel.getReviewById(parseInt(review_id))
  const loggedInUserId = res.locals.accountData.account_id;

  if (!reviewData || reviewData.account_id !== loggedInUserId) {
    req.flash("notice", "You do not have permission to delete this review.");
    return res.redirect("/account/");
  }

  const deleteResult = await reviewModel.deleteReview(review_id)

  if (deleteResult) {
    req.flash("notice", "The review was successfully deleted.")
    req.session.save(function() {
        res.redirect("/account/")
    })
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/review/delete/${review_id}`)
  }
}

module.exports = reviewCont