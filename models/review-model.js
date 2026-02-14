const pool = require("../database/")

/* *****************************
 * 1. Get all reviews for a specific inventory item
 * ***************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `SELECT r.review_id, r.review_text, r.review_date, r.inv_id, r.account_id, 
    a.account_firstname, a.account_lastname,
    (SUBSTR(a.account_firstname, 1, 1) || a.account_lastname) AS screen_name
    FROM review AS r
    JOIN account AS a ON r.account_id = a.account_id
    WHERE r.inv_id = $1
    ORDER BY r.review_date DESC` // Requirement: Newest first
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByInventoryId error " + error)
  }
}

/* *****************************
 * 2. Get all reviews written by a specific client (For Account Dashboard)
 * ***************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `SELECT r.review_id, r.review_text, r.review_date, r.inv_id, i.inv_make, i.inv_model
    FROM review AS r
    JOIN inventory AS i ON r.inv_id = i.inv_id
    WHERE r.account_id = $1
    ORDER BY r.review_date DESC`
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByAccountId error " + error)
  }
}

/* *****************************
 * 3. Get a specific review by review_id (For Editing)
 * ***************************** */
async function getReviewById(review_id) {
  try {
    const sql = `SELECT r.review_id, r.review_text, r.review_date, r.inv_id, r.account_id, i.inv_make, i.inv_model 
    FROM review AS r
    JOIN inventory AS i ON r.inv_id = i.inv_id
    WHERE r.review_id = $1`
    const data = await pool.query(sql, [review_id])
    return data.rows[0]
  } catch (error) {
    console.error("getReviewById error " + error)
  }
}

/* *****************************
 * 4. Add a new review
 * ***************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * 5. Update a review
 * ***************************** */
async function updateReview(review_id, review_text) {
  try {
    const sql = "UPDATE review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    return await pool.query(sql, [review_text, review_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * 6. Delete a review
 * ***************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM review WHERE review_id = $1'
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    return new Error("Delete Review Error")
  }
}

module.exports = {
  getReviewsByInventoryId,
  getReviewsByAccountId,
  getReviewById,
  addReview,
  updateReview,
  deleteReview
}