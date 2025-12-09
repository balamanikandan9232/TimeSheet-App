# Timesheet Management System (MERN)

A full-stack Timesheet Management System built with **React**, **Node.js**, **Express**, and **MongoDB**. It supports:

- Timesheet entry with validation
- Editable grid with inline update & delete
- CSV import (react-csv + PapaParse)
- CSV export
- Filtering by name, company, and date range
- Pagination & lazy loading

---

## Tech Stack

**Frontend**
- React 19
- Axios
- react-csv
- papaparse
- CSS (custom)

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- dotenv
- cors

---

## Project Structure

timesheet-app/
backend/
config/
db.js
controllers/
timesheetController.js
models/
Timesheet.js
routes/
timesheet.js
server.js
.env
package.json

frontend/
src/
components/
TimesheetEntry.jsx
TimesheetViewer.jsx
Grid.jsx
FileUpload.jsx
services/
api.js
App.jsx
index.js
styles.css
public/
index.html
package.json



---

## Backend Setup

1. Go to backend folder:

2. Install dependencies:

3. Create `.env` in `backend/`:

4. Run MongoDB (make sure a supported version is running on `localhost:27017`).

5. Start backend:

The API will be available at:

http://localhost:5000/api/timesheets


### API Endpoints

- `POST   /api/timesheets` – Create timesheet
- `GET    /api/timesheets` – List timesheets (with filters & pagination)
  - Query params: `name`, `companyName`, `fromDate`, `toDate`, `page`, `limit`
- `PUT    /api/timesheets/:id` – Update timesheet
- `DELETE /api/timesheets/:id` – Delete timesheet
- `GET    /api/timesheets/names` – Distinct names
- `GET    /api/timesheets/companies` – Distinct company names

---

## Frontend Setup

1. Go to frontend folder:


2. Install dependencies:

npm install axios react-csv papaparse date-fns

text

3. Check `src/services/api.js`:

import axios from "axios";

const api = axios.create({
baseURL: "http://localhost:5000/api/timesheets",
timeout: 10000,
});

export default api;

text

4. Start frontend:

npm start

text

App will run at:

http://localhost:3000

text

---

## Features

### 1. Timesheet Entry

- Name (dropdown – loaded from backend)
- Company Name (dropdown – loaded from backend)
- Date (date picker, future dates disabled)
- Punch In / Punch Out (time pickers)
- Total Hours (auto-calculated, clamped between 5 and 8 hours)
- CSV upload for bulk import (via `FileUpload` + PapaParse)

### 2. Timesheet Viewer

- Filters:
  - Search by **Name**
  - Search by **Company**
  - Date range (`fromDate` / `toDate`, future restricted)
- Grid:
  - Inline edit (update existing records)
  - Delete row
  - Pagination with lazy loading (server-side)
- Export:
  - Download currently displayed data as CSV (react-csv)

---

## Filtering & Pagination

Backend supports optional query parameters:

GET /api/timesheets?name=John&companyName=Freshworks&fromDate=2025-12-01&toDate=2025-12-10&page=1&limit=10

text

- If `name` is provided → filter by name (case-insensitive).
- If `companyName` is provided → filter by company.
- If both given → combined filter.
- If `fromDate` + `toDate` given → filter by date range.
- `page` + `limit` used for pagination.

---

## CSV Import

- CSV columns expected:

name,companyName,date,punchIn,punchOut,totalHours

text

- `FileUpload` component uses **PapaParse** to parse CSV and can be wired to a bulk create endpoint for mass inserts.

---

## Development Notes

- Ensure MongoDB version is supported by your driver and Compass.
- Adjust `DB_CONNECTION_STRING` as needed for your environment (Docker, Atlas, etc.).
- For production, configure:
  - Environment-specific `.env`
  - Proper CORS settings
  - Error handling and logging


---




