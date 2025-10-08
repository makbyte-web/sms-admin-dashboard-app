import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class SuperAdminSettings {
  static collectionName = "superadminSettings";

  constructor(currentAcademicYear, createdDate, createdBy, updatedDate, updatedBy, superadminSettingsID='new') {
    this.currentAcademicYear = currentAcademicYear;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.superadminSettingsID = superadminSettingsID;
  }

  addSuperAdminSettings = async () => {
    try {
      const newData = {
        currentAcademicYear: this.currentAcademicYear,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };

      const docRef = await addDoc(collection(db, SuperAdminSettings.collectionName.toString()), { ...newData });
      // console.log("SuperAdminSettings added with ID:", docRef?.id);

      return docRef?.id;
    } catch (error) {
      console.log("Error in addSuperAdminSettings:", error);
    }
  };

  updateSuperAdminSettings = async () => {
    try {
      const superadminSettingsID = this.superadminSettingsID;
      const newData = {
        currentAcademicYear: this.currentAcademicYear,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };

      const docRef = doc(db, SuperAdminSettings.collectionName.toString(), superadminSettingsID);
      await updateDoc(docRef, { ...newData });
      // console.log(`SuperAdminSettings ${superadminSettingsID} updated`);

      return docRef?.id;
    } catch (error) {
      console.log("Error in updateSchoolSetting:", error);
    }
  };

  static deleteSuperAdminSettings = async (superadminSettingsID) => {
    try {
      await deleteDoc(doc(db, SuperAdminSettings.collectionName.toString(), superadminSettingsID));
      // console.log(`School ${schoolId} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteSuperAdminSettings:", error);
    }
  };

  static getSuperAdminSettingsOwnedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, SuperAdminSettings.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ superadminSettingsID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getSuperAdminSettingsOwnedByUser:", error);
    }
  };

}