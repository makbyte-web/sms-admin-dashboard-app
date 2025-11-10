"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Papa from "papaparse";
import * as XLSX from "xlsx/xlsx.mjs";
import { acceptFileDataToUpload } from "@/actions/bulkOperations";
import { sampleFileURL } from "@/defaults";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [schoolID, setSchoolID] = useState(null);
  const [loggedInUserID, setLoggedInUserID] = useState(null);

  const pathname = usePathname();
  const source = pathname.split("/").pop();
  const resourceURL = sampleFileURL[source];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUserID = JSON.parse(localStorage.getItem("userID")) || "NA";
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";

      setLoggedInUserID(loggedInUserID);
      setSchoolID(schoolID);
    }
  }, []);

  const handleFileChange = (event) => {
    const fileName = event.target.files[0].name;
    setFileType(fileName.split(".")[1]);
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
    if (fileType === "csv") {
      reader.onload = (event) => {
        Papa.parse(event.target.result, {
          // first row of the CSV as the keys for the objects.
          header: true,
          // skips any empty lines
          skipEmptyLines: true,
          // callback receives the parsed data
          complete: (result) => {
            // rawData = result?.data
            setFileData(result?.data);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
          },
        });
      };

      reader.readAsText(file); // Read the file as text
    } else if (fileType === "xlsx") {
      reader.onload = (event) => {
        var data = event.target.result;
        var workbook = XLSX.read(data, { type: "binary" });

        var firstSheet = workbook.SheetNames[0];

        if (firstSheet.toLowerCase() !== source.toLowerCase()) {
          alert(
            `Not a valid import!\n\nSheetname: ${firstSheet} is not matching the page: ${source}.`
          );
          return;
        }

        workbook.SheetNames.forEach(function (sheetName) {
          var XL_row = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName]
          );
          var xlsxData = JSON.stringify(XL_row);
          // rawData =
          setFileData(JSON.parse(xlsxData));
        });
      };

      reader.onerror = (error) => {
        console.error("Error parsing XLSX:", error);
      };

      reader.readAsBinaryString(file);
    } else {
      alert("Only .CSV or .XLSX file supported.");
      return;
    }
  };

  useEffect(() => {
    async function transferData() {
      const { returnSource, recordInserted } = await acceptFileDataToUpload(
        fileData,
        source,
        schoolID,
        loggedInUserID
      );
      alert(
        `${recordInserted} ${returnSource} records added from file to database via bulk upload.`
      );
      if (recordInserted !== -1) {
        window.location.reload();
      }
    }

    if (fileData) transferData();
  }, [fileData]);

  return (
    <div className="flex justify-between flex-col gap-6 py-4">
      <div className=" flex gap-6 flex-wrap md:flex-nowrap">
        <label className="flex flex-col items-center w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Drag & drop or click to select a CSV or XLSX file
          </span>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <button
          disabled={!file}
          onClick={handleUpload}
          className={`px-4 py-2 rounded-lg shadow-lg transition
    bg-indigo-600 text-white 
    hover:bg-indigo-500 
    focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
    disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none`}
        >
          Upload
        </button>
      </div>
      <div className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5">
              ⚠️
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Important Requirements : Download Sample Files
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 dark:text-amber-400 mt-1">
                    •
                  </span>
                  <span>
                    Your file must be in <strong>.xlsx</strong> or{" "}
                    <strong>.csv</strong> format
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 dark:text-amber-400 mt-1">
                    •
                  </span>
                  <span>
                    It <strong>must include all the columns</strong> present in
                    the sample file
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  {/* <span className="text-amber-500 dark:text-amber-400 mt-1">
                    •
                  </span> */}
                  <span>
                    {/* Download Sample Files */}
                    <a
                      href={resourceURL[1]}
                      download={true}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded-lg text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium shadow-sm ml-1 mt-1 md:mt-0"
                    >
                      CSV Template
                    </a>
                    <a
                      href={resourceURL[0]}
                      download={true}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded-lg text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium shadow-sm ml-1 md:mt-0 mt-1"
                    >
                      XLXS Template
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
