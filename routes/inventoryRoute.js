// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classValidate = require("../utilities/add-classification-validation")
const invValidate = require("../utilities/add-inventory-validation")
const utilities = require("../utilities/")

// Route to build inventory management view (PROTECTED)
router.get("/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement));

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build by inventory id view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));


// Route to get inventory by classificationId - returns JSON objectfor the management view (PROTECTED)
router.get("/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON))


// Route to build add classification view (PROTECTED)
router.get("/add-classification", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification
));

// Route to process add classification (PROTECTED)
router.post(
  "/add-classification",
  utilities.checkAccountType,
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);



// Route to build add inventory view (PROTECTED)
router.get("/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory
));


// Route to process add inventory (PROTECTED)
router.post(
  "/add-inventory",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);


// Route to build the "edit inventory" view (PROTECTED)
router.get("/edit/:invId", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);


// Route to process the edit  (PROTECTED)
router.post("/edit/",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to build the "delete inventory" view (PROTECTED)
router.get("/delete/:invId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventory)
);

// Route to process the delete  (PROTECTED)
router.post("/delete/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);




module.exports = router;