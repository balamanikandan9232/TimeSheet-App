require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const timesheetRoutes = require("./routes/timesheet");

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/timesheets", timesheetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
