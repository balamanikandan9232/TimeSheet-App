const mongoose = require("mongoose");

const TimesheetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    date: { type: Date, required: true },
    punchIn: { type: String, required: true },
    punchOut: { type: String, required: true },
    totalHours: { type: Number, required: true, min: 5, max: 8 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Timesheet", TimesheetSchema);
