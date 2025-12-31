"use client";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { ParentStudents } from "@/firestore/documents/parentStudents";
import { ParentFCMToken } from "@/firestore/documents/parentFCMToken";
import { Attendance } from "@/firestore/documents/attendance";
import {
  getCurrentMonth,
  getFormatedDate,
  getDayName,
  validateDateBetween,
} from "@/lib/utils";
import { Holiday } from "@/firestore/documents/holiday";
import Header from "@/app/components/ui/header";

const Scanner = () => {
  const [scannedToken, setScannedToken] = useState("");
  const { user } = useUserContext();

  const loggedInUserID = user?.uid ? user?.uid : "NA";

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(handleScan, handleError);

    return () => scanner.clear();
  }, []);

  const handleScan = async (decodedText) => {
    const scannedData = JSON.parse(decodedText);

    const { schoolID, studentName, studentID, academicYear } = scannedData;

    let allowed = true;
    let switchValidated = false;
    let msg = "";
    const today = new Date().toLocaleDateString("en-IN");
    const todaysDay = getDayName(today);
    const currentMonth = getCurrentMonth(today);

    const holidayDataRes = await Holiday.getHolidayBySchool(
      schoolID,
      academicYear
    );

    const defaultHolidays = holidayDataRes.filter(
      (item) => item.holidayDate === "NA" && item.endDate === "NA"
    );

    const filteredHolidaysByMonth = holidayDataRes.filter((item) => {
      const isValidDate = (dateStr) => {
        if (!dateStr || dateStr === "NA") return false;
        const month = parseInt(dateStr.split("/")[1]);
        return month == currentMonth;
      };

      return isValidDate(item.holidayDate) || isValidDate(item.endDate);
    });

    const holidayData = [...filteredHolidaysByMonth, ...defaultHolidays];

    if (holidayData?.length) {
      // check for individual holiday
      switch (todaysDay) {
        case "Saturday":
          holidayData?.forEach((holiday) => {
            if (holiday?.dayOfWeek === todaysDay) {
              switchValidated = true;
              allowed = false;
              msg = `Not allowed to add attendance bcoz today is ${holiday?.dayOfWeek}`;
            }
          });
          break;
        case "Sunday":
          holidayData?.forEach((holiday) => {
            if (holiday?.dayOfWeek === todaysDay) {
              switchValidated = true;
              allowed = false;
              msg = `Not allowed to add attendance bcoz today is ${holiday?.dayOfWeek}`;
            }
          });
          break;
        default:
          holidayData?.forEach((holiday) => {
            if (
              holiday?.holidayDate !== "NA" &&
              getFormatedDate(holiday?.holidayDate) === today
            ) {
              switchValidated = true;
              allowed = false;
              msg = `Not allowed to add attendance bcoz school is closed due to ${holiday?.occasion}`;
            }
          });
      }

      // checking for date lies between any vacation or break
      if (switchValidated === false) {
        holidayData?.forEach((holiday) => {
          if (holiday?.holidayDate !== "NA" && holiday?.endDate !== "NA") {
            if (
              validateDateBetween(
                holiday?.holidayDate,
                holiday?.endDate,
                today,
                currentMonth
              )
            ) {
              allowed = false;
              msg = `Not allowed to add attendance bcoz school is closed due to ${holiday?.occasion}`;
            }
          }
        });
      }
    } else {
      allowed = false;
      msg =
        "No Academic hoildays found. Kindly goto School -> View Profile -> Academic Holiday. To add Holiday Record.";
    }

    if (allowed) {
      const psData = await ParentStudents.getParentStudentsBySchool(schoolID);

      const parentData = [];
      psData?.forEach((parent) => {
        parent?.children?.forEach((child) => {
          if (child === studentID) {
            parentData.push(parent);
          }
        });
      });

      if (parentData?.length) {
        const fcmData = await ParentFCMToken.getParentFCMTokenByParentID(
          parentData[0]?.parentID
        );

        if (fcmData?.length) {
          const attendanceExists = await Attendance.getAttendanceByStudent(
            schoolID,
            academicYear,
            studentID
          );

          const studentExists = attendanceExists !== undefined ? attendanceExists?.filter(
            (attendance) => attendance?.attendanceDate === today
          ) : [];

          if (studentExists && studentExists.length === 0) {
            const newAttendance = new Attendance(
              schoolID,
              studentID,
              academicYear,
              "P",
              today,
              new Date().toLocaleTimeString("en-IN"),
              "dashboard-app-daily",
              today,
              loggedInUserID,
              "NA",
              "NA"
            );

            const retval = await newAttendance.addAttendance();
            const subheading = `Attendance marked for ${studentName}`;
            alert(`${subheading} on ${today} recorded with AttendanceID: ${retval}`);

            if (fcmData?.length) {
              await sendNotification(
                fcmData[0]?.fcmToken,
                subheading,
                scannedData
              );
              return;
            }
          } else {
            alert(
              `Attendace for ${studentName} is already marked for ${today}.`
            );
            return;
          }
        } else {
          alert("Parent must logged in from mobile app.");
          return;
        }
      } else {
        alert("Student is not linked to linked to Parent.");
        return;
      }
    } else {
      alert(msg);
      return;
    }
  };

  const handleError = (error) => {
    console.error("QR Scan Error:", error);
  };

  const sendNotification = async (token, subheading, scannedData) => {
    try {
      const response = await fetch("/api/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pushToken: token,
          title: "Attendance",
          subheading: subheading,
          QRInfo: { ...scannedData },
        }),
      });

      const data = await response.json();
      console.log("Push notification response");
      alert("Notification sent successfully!");
      setScannedToken("");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification.");
    }
  };

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <Header currentPage={"Scanner"}></Header>
      <div className="min-h-screen flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
        <div
          id="qr-reader"
          className="w-full max-w-md border border-gray-300 rounded-lg shadow-lg p-4"
        ></div>

        {scannedToken && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-green-600">
              ✅ Token: {scannedToken}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
