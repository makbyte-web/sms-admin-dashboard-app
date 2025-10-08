import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class FeesMapping {
  static collectionName = "feesMapping";

  constructor(schoolID, academicYear, assignTo, assigneeID, assignedGroups, createdDate, createdBy, updatedDate, updatedBy, feesMapID='new') {
    this.schoolID = schoolID;
    this.academicYear = academicYear;
    this.assignTo = assignTo;
    this.assigneeID = assigneeID;
    this.assignedGroups = assignedGroups;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.feesMapID = feesMapID
  }

  addFeesMapping = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        assignTo: this.assignTo,
        assigneeID: this.assigneeID,
        assignedGroups: this.assignedGroups,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, FeesMapping.collectionName.toString()), { ...newData });
      //console.log("FeesMapping added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addNewFeesMapping:", error);
    }
  };

  updateFeesMapping = async () => {
    try {
      const feesMapID = this.feesMapID;
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        assignTo: this.assignTo,
        assigneeID: this.assigneeID,
        assignedGroups: this.assignedGroups,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, FeesMapping.collectionName.toString(), feesMapID);
      await updateDoc(docRef, { ...newData });
      // console.log(`FeesMapping ${feesMapID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateFeesMapping:", error);
    }
  };

  static deleteFeesMapping = async (feesMapID) => {
    try {
      await deleteDoc(doc(db, FeesMapping.collectionName.toString(), feesMapID));
      // console.log(`FeesMapping ${feesMapID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteFeesMapping:", error);
    }
  };

  static getFeesMapping = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, FeesMapping.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ feesMapID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getFeesMapping:", error);
    }
  };

  static getFeesMappingCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, FeesMapping.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ feesMapID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getFeesMappingCreatedByUser:", error);
    }
  };

  static getFeesMappingBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, FeesMapping.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ feesMapID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getFeesMappingBySchool:", error);
    }
  };

  static getFeesMapping = async (feesMapID) => {
    try {
      const docRef = doc(db, FeesMapping.collectionName.toString(), feesMapID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No FeesMapping found with ${feesMapID}!`
      }
    } catch (error) {
      console.log("Error in getFeesMapping By ID:", error);
    }
  };
}