import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class SchoolSettings {
  static collectionName = "schoolSettings";

  constructor(schoolID, currentAcademicYear, createdDate, createdBy, updatedDate, updatedBy, schoolSettingsID='new') {
    this.schoolID = schoolID;
    this.currentAcademicYear = currentAcademicYear;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.schoolSettingsID = schoolSettingsID;
  }

  addSchoolSettings = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        currentAcademicYear: this.currentAcademicYear,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };

      const docRef = await addDoc(collection(db, SchoolSettings.collectionName.toString()), { ...newData });
      // console.log("SchoolSettings added with ID:", docRef?.id);

      return docRef?.id;
    } catch (error) {
      console.log("Error in addSchoolSettings:", error);
    }
  };

  updateSchoolSettings = async () => {
    try {
      const schoolSettingsID = this.schoolSettingsID;
      const newData = {
        schoolID: this.schoolID,
        currentAcademicYear: this.currentAcademicYear,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };

      const docRef = doc(db, SchoolSettings.collectionName.toString(), schoolSettingsID);
      await updateDoc(docRef, { ...newData });
      // console.log(`SchoolSettings ${schoolSettingsID} updated`);

      return docRef?.id;
    } catch (error) {
      console.log("Error in updateSchoolSetting:", error);
    }
  };

  static deleteSchoolSettings = async (schoolSettingsID) => {
    try {
      await deleteDoc(doc(db, SchoolSettings.collectionName.toString(), schoolSettingsID));
      // console.log(`School ${schoolId} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteSchoolSettings:", error);
    }
  };

  static getSchoolSettingsBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, SchoolSettings.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ schoolSettingsID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getSchoolSettingsBySchool:", error);
    }
  };

  static getSchoolSettingsOwnedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, SchoolSettings.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ schoolSettingsID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getSchoolSettingsOwnedByUser:", error);
    }
  };

}