import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { deleteCloudinaryImage } from "@/actions/file";
import { defaultUrlDP } from "@/defaults";

export class Students {
  static collectionName = "students";

  constructor(schoolID, studentName, stdID, divID, email, grNo, academicYear, urlDP, urlQR, cloudinaryImageId, createdDate, createdBy, updatedDate, updatedBy, studentID = "new") {
    this.schoolID = schoolID;
    this.studentName = studentName;
    this.stdID = stdID;
    this.divID = divID;
    this.email = email;
    this.grNo = grNo;
    this.academicYear = academicYear;
    this.urlDP = urlDP;
    this.cloudinaryImageId = cloudinaryImageId || "";
    this.urlQR = urlQR;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.studentID = studentID;
  }

  addStudent = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        studentName: this.studentName,
        stdID: this.stdID,
        divID: this.divID,
        email: this.email,
        grNo: this.grNo,
        academicYear: this.academicYear,
        urlDP: this.urlDP,
        cloudinaryImageId: this.cloudinaryImageId,
        urlQR: this.urlQR,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = await addDoc(
        collection(db, Students.collectionName.toString()),
        { ...newData }
      );
      // console.log("Student added with ID:", docRef?.id);
      return docRef?.id;
    } catch (error) {
      console.log("Error in addNewStudent:", error);
    }
  };

  updateStudent = async () => {
    try {
      const studentID = this.studentID;
      const newData = {
        schoolID: this.schoolID,
        studentName: this.studentName,
        stdID: this.stdID,
        divID: this.divID,
        email: this.email,
        grNo: this.grNo,
        academicYear: this.academicYear,
        urlDP: this.urlDP,
        cloudinaryImageId: this.cloudinaryImageId,
        urlQR: this.urlQR,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, Students.collectionName.toString(), studentID);
      await updateDoc(docRef, { ...newData });
      // console.log(`Student ${studentID} updated`);
      return docRef?.id;
    } catch (error) {
      console.log("Error in updateStudent:", error);
    }
  };

  static deleteStudent = async (studentID) => {
    try {
       const docRef = doc(
        db,
        Students.collectionName,
        studentID
      );

      const docSnap = await getDoc(docRef); 

      if (docSnap.exists()) {
        const student = docSnap.data();

        if (
          student.cloudinaryImageId && 
          student.urlDP !== defaultUrlDP 
        ) {
          await deleteCloudinaryImage(
            student.cloudinaryImageId
          ); 
        }
      }

      await deleteDoc(docRef);
      // console.log(`Student ${studentID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteStudent:", error);
    }
  };

  static getStudents = async () => {
    try {
      const data = [];
      const querySnapshot = await getDocs(collection(db, Students.collectionName.toString()));
      querySnapshot.forEach((doc) => {
        data.push({ studentID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getStudents:", error);
    }
  };

  static getStudentsCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, Students.collectionName.toString()),
        where("createdBy", "==", userID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ studentID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getStudentsCreatedByUser:", error);
    }
  };

  static getStudentsBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, Students.collectionName.toString()),
        where("schoolID", "==", schoolID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ studentID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getStudentsBySchool:", error);
    }
  };

  static getStudent = async (studentID) => {
    try {
      const docRef = doc(db, Students.collectionName.toString(), studentID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data;
      } else {
        return `No Student found with ${studentID}!`;
      }
    } catch (error) {
      console.log("Error in getStudent By ID:", error);
    }
  };

  static getStudentsByQRInfo = async (schoolID, studentName, grNo) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, Students.collectionName.toString()),
        where("schoolID", "==", schoolID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ studentID: doc.id, ...doc.data() });
      });
      const studentByQRInfo = data.filter(
        (student) =>
          student.grNo === grNo && student.studentName === studentName
      );
      if (studentByQRInfo.length) return studentByQRInfo[0];
    } catch (error) {
      console.log("Error in getStudentsByQRInfo:", error);
    }
  };
}
