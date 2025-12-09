import React, { useState } from "react";
import Papa from "papaparse";

const FileUpload = ({ onImport }) => {
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setUploading(true);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onImport(results.data);
          setUploading(false);
        },
        error: (error) => {
          console.error("CSV Parse error:", error);
          setUploading(false);
          alert("Error parsing CSV file");
        },
      });
    }
  };

  return (
    <div className="form-group">
      <label>📁 Upload Timesheet Data (CSV)</label>
      <div className="file-upload-wrapper">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file-input"
          disabled={uploading}
        />
        {uploading && <span className="upload-status">Uploading...</span>}
        {fileName && !uploading && (
          <span className="file-name">{fileName}</span>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
