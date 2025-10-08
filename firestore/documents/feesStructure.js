import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class FeesStructure {
  static collectionName = "feesStructure";

  constructor(schoolID, academicYear, groupName, feesInStructure, dueDate, createdDate, createdBy, updatedDate, updatedBy, feesStructureID='new') {
    this.schoolID = schoolID;
    this.academicYear = academicYear;
    this.groupName = groupName;
    this.feesInStructure = feesInStructure;
    this.dueDate = dueDate;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.feesStructureID = feesStructureID
  }

  addFeesStructure = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        groupName: this.groupName,
        feesInStructure: this.feesInStructure,
        dueDate: this.dueDate,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, FeesStructure.collectionName.toString()), { ...newData });
      //console.log("FeesStructure added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addNewFeesStructure:", error);
    }
  };

  updateFeesStructure = async () => {
    try {
      const feesStructureID = this.feesStructureID;
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        groupName: this.groupName,
        feesInStructure: this.feesInStructure,
        dueDate: this.dueDate,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, FeesStructure.collectionName.toString(), feesStructureID);
      await updateDoc(docRef, { ...newData });
      // console.log(`FeesStructure ${feesStructureID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateFeesStructure:", error);
    }
  };

  static deleteFeesStructure = async (feesStructureID) => {
    try {
      await deleteDoc(doc(db, FeesStructure.collectionName.toString(), feesStructureID));
      // console.log(`FeesStructure ${feesStructureID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteFeesStructure:", error);
    }
  };

  static getFeesStructure = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, FeesStructure.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ feesStructureID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getFeesStructure:", error);
    }
  };

  static getFeesStructureCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, FeesStructure.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ feesStructureID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getFeesStructureCreatedByUser:", error);
    }
  };

  static getFeesStructureBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, FeesStructure.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ feesStructureID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getFeesStructureBySchool:", error);
    }
  };

  static getFeeStructure = async (feesStructureID) => {
    try {
      const docRef = doc(db, FeesStructure.collectionName.toString(), feesStructureID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No FeeStructure found with ${feesStructureID}!`
      }
    } catch (error) {
      console.log("Error in getFeeStructure By ID:", error);
    }
  };
}