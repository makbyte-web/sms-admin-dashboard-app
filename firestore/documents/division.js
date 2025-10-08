import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where, getCountFromServer} from "firebase/firestore";

export class Divisions {
  static collectionName = "divisions";

  constructor(schoolID, divName, createdDate, createdBy, updatedDate, updatedBy, divID='new') {
    this.schoolID = schoolID;
    this.divName = divName;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.divID = divID
  }

  addDivision = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        divName: this.divName,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, Divisions.collectionName.toString()), { ...newData });
      //console.log("Division added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addNewDivision:", error);
    }
  };

  updateDivision = async () => {
    try {
      const divID = this.divID;
      const newData = {
        schoolID: this.schoolID,
        divName: this.divName,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, Divisions.collectionName.toString(), divID);
      await updateDoc(docRef, { ...newData });
      // console.log(`Division ${divID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateDivision:", error);
    }
  };

  static deleteDivision = async (divID) => {
    try {
      await deleteDoc(doc(db, Divisions.collectionName.toString(), divID));
      // console.log(`Division ${divID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteDivision:", error);
    }
  };

  static getDivisions = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, Divisions.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ divID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getDivisions:", error);
    }
  };

  static getDivisionsCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Divisions.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ divID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getDivisionsCreatedByUser:", error);
    }
  };

  static getDivisionsBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Divisions.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ divID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getDivisionsBySchool:", error);
    }
  };

  static getDivision = async (divID) => {
    try {
      const docRef = doc(db, Divisions.collectionName.toString(), divID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No Division found with ${divID}!`
      }
    } catch (error) {
      console.log("Error in getDivision By ID:", error);
    }
  };

  static getDivisionCountForSchool = async (schoolID) => {
    try {
      const collectionRef = collection(db, Divisions.collectionName.toString());
      const queryRes = query(collectionRef, where("schoolID", "==", schoolID));
      const snapshot = await getCountFromServer(queryRes);
      const count = snapshot.data().count;
      return count
    } catch (error) {
      console.log("Error in getDivisionCountForSchool:", error);
    }
  };
}