const express = require("express");
const router = express.Router();
const { create, fetchAll, update } = require("./controller");

router.get("/fetchAll", fetchAll);
router.post("/create", create);
router.put("/update/:id", update);

module.exports = router;
