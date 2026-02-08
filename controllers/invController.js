const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null
    })
  } catch (error) {
    return next({status: 404, message: 'Sorry, we appear to have lost that page.'})
  }



}


/* ***************************
 *  Build inventory item by inventory id view
 * ************************** */

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  try {
    const grid = await utilities.buildVehicleDetail(data[0])
    let nav = await utilities.getNav()
    const invName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/vehicle", {
      title: invName,
      nav,
      grid,
      errors: null,
      inv_id: inv_id
    })
  } catch (error) {
    return next({status: 404, message: 'Sorry, we appear to have lost that page.'})
  }
}



invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav(req, res, next)
  const classificationList = await utilities.buildClassificationList() 
  
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationList
  })
}


invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)
  if (result) {
    req.flash("notice", `Congratulations, ${classification_name} classification has been added.`)
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Sorry, there was an error adding the classification.")
    res.status(500).redirect("/inv/add-classification")
  }
}


invCont.buildAddInventory = async function (req, res,next) {
  const classificationList = await utilities.buildClassificationList()
  let nav = await utilities.getNav(req, res, next)
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null
  })
}

invCont.addInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result) {
    req.flash("notice", `Congratulations, ${inv_make} ${inv_model} has been added.`)
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Sorry, there was an error adding the vehicle.")
    res.status(500).redirect("/inv/add-inventory")
  }
}



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build the "edit inventory" view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const item = itemData[0] 

  const classificationList = await utilities.buildClassificationList(item.classification_id)
  const itemName = `${item.inv_make} ${item.inv_model}`
  
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: item.inv_id,
    inv_make: item.inv_make,
    inv_model: item.inv_model,
    inv_year: item.inv_year,
    inv_description: item.inv_description,
    inv_image: item.inv_image,
    inv_thumbnail: item.inv_thumbnail,
    inv_price: item.inv_price,
    inv_miles: item.inv_miles,
    inv_color: item.inv_color,
    classification_id: item.classification_id
  })
}




module.exports = invCont