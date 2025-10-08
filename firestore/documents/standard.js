import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where, getCountFromServer } from "firebase/firestore";

export class Standards {
  static collectionName = "standards";

  constructor(schoolID, stdName, createdDate, createdBy, updatedDate, updatedBy, stdID='new') {
    this.schoolID = schoolID;
    this.stdName = stdName;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.stdID = stdID
  }

  addStandard = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        stdName: this.stdName,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, Standards.collectionName.toString()), { ...newData });
      //console.log("Standard added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addNewStandard:", error);
    }
  };

  updateStandard = async () => {
    try {
      const stdID = this.stdID;
      const newData = {
        schoolID: this.schoolID,
        stdName: this.stdName,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, Standards.collectionName.toString(), stdID);
      await updateDoc(docRef, { ...newData });
      // console.log(`Standard ${stdID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateStandard:", error);
    }
  };

  static deleteStandard = async (stdID) => {
    try {
      await deleteDoc(doc(db, Standards.collectionName.toString(), stdID));
      // console.log(`Standard ${stdID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteStandard:", error);
    }
  };

  static getStandards = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, Standards.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ stdID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getStandards:", error);
    }
  };

  static getStandardsCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Standards.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ stdID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getStandardsCreatedByUser:", error);
    }
  };

  static getStandardsBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Standards.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ stdID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getStandardsBySchool:", error);
    }
  };

  static getStandard = async (stdID) => {
    try {
      const docRef = doc(db, Standards.collectionName.toString(), stdID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No Standard found with ${stdID}!`
      }
    } catch (error) {
      console.log("Error in getStandard By ID:", error);
    }
  };

  static getStandardCountForSchool = async (schoolID) => {
    try {
      const collectionRef = collection(db, Standards.collectionName.toString());
      const queryRes = query(collectionRef, where("schoolID", "==", schoolID));
      const snapshot = await getCountFromServer(queryRes);
      const count = snapshot.data().count;
      return count
    } catch (error) {
      console.log("Error in getStandardCountForSchool:", error);
    }
  };
}