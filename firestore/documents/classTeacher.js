import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class ClassTeacher {
  static collectionName = "classTeacher";

  constructor(schoolID, academicYear, teacherID, stdID, divID, createdDate, createdBy, updatedDate, updatedBy, ctID='new') {
    this.schoolID = schoolID;
    this.academicYear = academicYear;
    this.teacherID = teacherID;
    this.stdID = stdID;
    this.divID = divID;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.ctID = ctID;
  }

  addClassTeacher = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        teacherID : this.teacherID,
        stdID: this.stdID,
        divID: this.divID,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, ClassTeacher.collectionName.toString()), { ...newData });
      // console.log("ClassTeacher added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addClassTeacher:", error);
    }
  };

  updateClassTeacher = async () => {
    try {
      const ctID = this.ctID;
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        teacherID : this.teacherID,
        stdID: this.stdID,
        divID: this.divID,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, ClassTeacher.collectionName.toString(), ctID);
      await updateDoc(docRef, { ...newData });
      // console.log(`ClassTeacher ${ctID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateClassTeacher:", error);
    }
  };

  static deleteClassTeacher = async (ctID) => {
    try {
      await deleteDoc(doc(db, ClassTeacher.collectionName.toString(), ctID));
      // console.log(`ClassTeacher ${ctID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteClassTeacher:", error);
    }
  };

  static getClassTeachers = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, ClassTeacher.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ctID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getClassTeachers:", error);
    }
  };

  static getClassTeachersCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, ClassTeacher.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ ctID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getClassTeachersCreatedByUser:", error);
    }
  };

  static getClassTeachersBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, ClassTeacher.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ ctID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getClassTeachersBySchool:", error);
    }
  };

  static getClassTeacherByID = async (ctID) => {
    try {
      const docRef = doc(db, ClassTeacher.collectionName.toString(), ctID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No ClassTeacher found with ${ctID}!`
      }
    } catch (error) {
      console.log("Error in getClassTeacherByID:", error);
    }
  };
}