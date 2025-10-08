import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class FeesType {
  static collectionName = "feesType";

  constructor(schoolID, feesType, amount, createdDate, createdBy, updatedDate, updatedBy, feesTypeID='new') {
    this.schoolID = schoolID;
    this.feesType = feesType;
    this.amount = amount;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.feesTypeID = feesTypeID
  }

  addFeesType = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        feesType: this.feesType,
        amount: this.amount,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, FeesType.collectionName.toString()), { ...newData });
      //console.log("FeesType added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addNewFeesType:", error);
    }
  };

  updateFeesType = async () => {
    try {
      const feesTypeID = this.feesTypeID;
      const newData = {
        schoolID: this.schoolID,
        feesType: this.feesType,
        amount: this.amount,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, FeesType.collectionName.toString(), feesTypeID);
      await updateDoc(docRef, { ...newData });
      // console.log(`FeesType ${feesTypeID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateFeesType:", error);
    }
  };

  static deleteFeesType = async (feesTypeID) => {
    try {
      await deleteDoc(doc(db, FeesType.collectionName.toString(), feesTypeID));
      // console.log(`FeesType ${feesTypeID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteFeesType:", error);
    }
  };

  static getFeesType = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, FeesType.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ feesTypeID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getFeesType:", error);
    }
  };

  static getFeesTypeCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, FeesType.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ feesTypeID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getFeesTypeCreatedByUser:", error);
    }
  };

  static getFeesTypeBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, FeesType.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ feesTypeID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getFeesTypeBySchool:", error);
    }
  };

  static getFeeType = async (feesTypeID) => {
    try {
      const docRef = doc(db, FeesType.collectionName.toString(), feesTypeID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No FeeType found with ${feesTypeID}!`
      }
    } catch (error) {
      console.log("Error in getFeeType By ID:", error);
    }
  };
}