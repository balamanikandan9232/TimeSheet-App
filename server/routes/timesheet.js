const express = require("express");
const router = express.Router();
const {
  createTimesheet,
  getTimesheets,
  updateTimesheet,
  deleteTimesheet,
  getNames,
  getCompanies,
} = require("../controllers/timesheetController");

router.post("/", createTimesheet);
router.get("/", getTimesheets);
router.put("/:id", updateTimesheet);
router.delete("/:id", deleteTimesheet);
router.get("/names", getNames);
router.get("/companies", getCompanies);

module.exports = router;
