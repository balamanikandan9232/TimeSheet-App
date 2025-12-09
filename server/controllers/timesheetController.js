const Timesheet = require("../models/Timesheet");

exports.createTimesheet = async (req, res) => {
  try {
    console.log("POST /api/timesheets body:", req.body);
    const timesheet = new Timesheet(req.body);
    await timesheet.save();
    console.log("Saved timesheet with id:", timesheet._id);
    res.status(201).json(timesheet);
  } catch (error) {
    console.error("Create error:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTimesheets = async (req, res) => {
  try {
    const {
      name,
      companyName,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = {};
    if (name) filter.name = new RegExp(name, "i");
    if (companyName) filter.companyName = new RegExp(companyName, "i");
    if (fromDate && toDate) {
      filter.date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate + "T23:59:59.999Z"),
      };
    }

    const total = await Timesheet.countDocuments(filter);
    const timesheets = await Timesheet.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      data: timesheets,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTimesheet = async (req, res) => {
  try {
    const timesheet = await Timesheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!timesheet) {
      return res.status(404).json({ error: "Timesheet not found" });
    }
    res.json(timesheet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTimesheet = async (req, res) => {
  try {
    const timesheet = await Timesheet.findByIdAndDelete(req.params.id);
    if (!timesheet) {
      return res.status(404).json({ error: "Timesheet not found" });
    }
    res.json({ message: "Timesheet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNames = async (req, res) => {
  try {
    const names = await Timesheet.distinct("name");
    res.json(names);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Timesheet.distinct("companyName");
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
