const express = require("express");
const { loginAdmin } = require("../controller/adminController.js");

const router = express.Router();


router.post("/login", loginAdmin);

module.exports = router;
