import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class ParentStudents {
  static collectionName = "parentStudents";

  constructor(schoolID, academicYear, parentID, children, createdDate, createdBy, updatedDate, updatedBy, psID='new') {
    this.schoolID = schoolID;
    this.academicYear = academicYear;
    this.parentID = parentID;
    this.children = children;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.psID = psID;
  }

  addParentStudents = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        parentID : this.parentID,
        children: this.children,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, ParentStudents.collectionName.toString()), { ...newData });
      // console.log("ParentStudents added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addParentStudents:", error);
    }
  };

  updateParentStudents = async () => {
    try {
      const psID = this.psID;
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        parentID : this.parentID,
        children: this.children,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, ParentStudents.collectionName.toString(), psID);
      await updateDoc(docRef, { ...newData });
      // console.log(`ParentStudents ${psID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateParentStudents:", error);
    }
  };

  static deleteParentStudents = async (psID) => {
    try {
      await deleteDoc(doc(db, ParentStudents.collectionName.toString(), psID));
      // console.log(`ParentStudents ${psID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteParent:", error);
    }
  };

  static getParentStudents = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, ParentStudents.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ psID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParentStudents:", error);
    }
  };

  static getParentStudentsCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, ParentStudents.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ psID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParentStudentsCreatedByUser:", error);
    }
  };

  static getParentStudentsBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, ParentStudents.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ psID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParentStudentsBySchool:", error);
    }
  };

  static getParentStudentsByID = async (psID) => {
    try {
      const docRef = doc(db, ParentStudents.collectionName.toString(), psID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No ParentStudents found with ${psID}!`
      }
    } catch (error) {
      console.log("Error in getParentStudentsByID:", error);
    }
  };
}