import React, { useState } from "react";
import TimesheetEntry from "./components/TimesheetEntry";
import TimesheetViewer from "./components/TimesheetViewer";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);
  return (
    <div className="app">
      <header className="app-header">
        <h1>🕒 Timesheet Management System</h1>
      </header>

      <main className="container">
        <section className="section">
          <h2>📝 Timesheet Entry</h2>
          <TimesheetEntry onRefresh={handleRefresh} />
        </section>

        <section className="section">
          <h2>📊 Timesheet Viewer</h2>
          <TimesheetViewer key={refreshKey} onRefresh={handleRefresh} />
        </section>
      </main>
    </div>
  );
}

export default App;
