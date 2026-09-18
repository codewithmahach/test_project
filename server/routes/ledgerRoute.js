const express = require("express");
const {
  getAllProperties,
  getPropertyDetails,
  getBalance,
  investInProperty,
  transferTokens,
  mintTokens,
  getTransactions,
  getContracts,
} = require("../controllers/ledgerController");

const router = express.Router();

router.route("/properties").get(getAllProperties);
router.route("/properties/:id").get(getPropertyDetails);
router.route("/balance/:address").get(getBalance);
router.route("/invest").post(investInProperty);
router.route("/transfer").post(transferTokens);
router.route("/mint").post(mintTokens);
router.route("/transactions").get(getTransactions);
router.route("/contracts").get(getContracts);

module.exports = router;
