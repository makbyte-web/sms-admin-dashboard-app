"use client";
import React, { useState } from "react";
import Papa from "papaparse";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    // FileReader is used to read the contents of the file as a string.
    const reader = new FileReader();

    // reader.onload is triggered when the file is successfully read. The CSV data is passed to Papa.parse, which parses it into JSON objects.
    reader.onload = (event) => {
      Papa.parse(event.target.result, {
        // first row of the CSV as the keys for the objects.
        header: true,
        // skips any empty lines
        skipEmptyLines: true,
        // callback receives the parsed data
        complete: (result) => {
          setCsvData(result.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    };

    reader.readAsText(file); // Read the file as text
  };

  return (
    <div className="flex items-center gap-4 py-4 bg-white dark:bg-gray-800 rounded-lg">
      <label className="flex flex-col items-center w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Drag & drop or click to select a CSV file
        </span>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      <button
        onClick={handleUpload}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition"
      >
        Upload
      </button>
    </div>
  );
};

export default UploadCSV;
