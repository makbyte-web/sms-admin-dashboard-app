import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class Attendance {
  static collectionName = "attendance";

  constructor(schoolID, studentID, academicYear, attendance, attendanceDate, attendanceTime, source, createdDate, createdBy, updatedDate, updatedBy, attendanceID='new') {
    this.schoolID = schoolID;
    this.studentID = studentID;
    this.academicYear = academicYear;
    this.attendance = attendance;
    this.attendanceDate = attendanceDate;
    this.attendanceTime = attendanceTime;
    this.source = source;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.attendanceID = attendanceID;
  }

  addAttendance = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        studentID: this.studentID,
        academicYear: this.academicYear,
        attendance: this.attendance,
        attendanceDate: this.attendanceDate,
        attendanceTime: this.attendanceTime,
        source: this.source,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, Attendance.collectionName.toString()), { ...newData });
      // console.log("Attendance added with ID:", docRef?.id);
      return docRef?.id;
    } catch (error) {
      console.log("Error in addNewAttendance:", error);
    }
  };

  updateAttendance = async () => {
    try {
      const attendanceID = this.attendanceID;
      const newData = {
        schoolID: this.schoolID,
        studentID: this.studentID,
        academicYear: this.academicYear,
        attendance: this.attendance,
        attendanceDate: this.attendanceDate,
        attendanceTime: this.attendanceTime,
        source: this.source,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = doc(db, Attendance.collectionName.toString(), attendanceID);
      await updateDoc(docRef, { ...newData });
      // console.log(`Attendance ${attendanceID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateAttendance:", error);
    }
  };

  static deleteAttendance = async (attendanceID) => {
    try {
      await deleteDoc(doc(db, Attendance.collectionName.toString(), attendanceID));
      // console.log(`Attendance ${attendanceID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteAttendance:", error);
    }
  };

  static getAttendance = async () => {
    try {
      const data = [];
      const querySnapshot = await getDocs(collection(db, Attendance.collectionName.toString()));
      querySnapshot.forEach((doc) => {
        data.push({ attendanceID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getAttendance:", error);
    }
  };

  static getAttendanceCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Attendance.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ attendanceID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getAttendanceCreatedByUser:", error);
    }
  };

  static getAttendanceBySchool = async (schoolID, academicYear) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Attendance.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ attendanceID: doc.id, ...doc.data() });
      });
      const attendanceBySchool = data.filter((attendance) => attendance.academicYear === academicYear)
      if (attendanceBySchool?.length) return attendanceBySchool
    } catch (error) {
      console.log("Error in getAttendanceBySchool:", error);
    }
  };

  static getAttendance = async (attendanceID) => {
    try {
      const docRef = doc(db, Attendance.collectionName.toString(), attendanceID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No Attendance found with ${attendanceID}!`
      }
    } catch (error) {
      console.log("Error in getAttendance By ID:", error);
    }
  };

  static getAttendanceByStudent = async (schoolID, academicYear, studentID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Attendance.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ attendanceID: doc.id, ...doc.data() });
      });
      const attendanceByStudent = data.filter((attendance) => attendance.academicYear === academicYear && attendance.studentID === studentID)
      if (attendanceByStudent.length) return attendanceByStudent
    } catch (error) {
      console.log("Error in getAttendanceByStudent:", error);
    }
  };
  
}