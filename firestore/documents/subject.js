import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where, getCountFromServer } from "firebase/firestore";

export class Subjects {
  static collectionName = "subjects";

  constructor(schoolID, subName, createdDate, createdBy, updatedDate, updatedBy, subID='new') {
    this.schoolID = schoolID;
    this.subName = subName;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.subID = subID
  }

  addSubject = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        subName: this.subName,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, Subjects.collectionName.toString()), { ...newData });
      //console.log("Subject added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addNewSubject:", error);
    }
  };

  updateSubject = async () => {
    try {
      const subID = this.subID;
      const newData = {
        schoolID: this.schoolID,
        subName: this.subName,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, Subjects.collectionName.toString(), subID);
      await updateDoc(docRef, { ...newData });
      // console.log(`Subject ${subID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateSubject:", error);
    }
  };

  static deleteSubject = async (subID) => {
    try {
      await deleteDoc(doc(db, Subjects.collectionName.toString(), subID));
      // console.log(`Subject ${subID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteSubject:", error);
    }
  };

  static getSubjects = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, Subjects.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ subID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getSubjects:", error);
    }
  };

  static getSubjectsCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Subjects.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ subID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getSubjectsCreatedByUser:", error);
    }
  };

  static getSubjectsBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Subjects.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ subID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getSubjectsBySchool:", error);
    }
  };

  static getSubject = async (subID) => {
    try {
      const docRef = doc(db, Subjects.collectionName.toString(), subID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No Subject found with ${subID}!`
      }
    } catch (error) {
      console.log("Error in getSubject By ID:", error);
    }
  };

  static getSubjectCountForSchool = async (schoolID) => {
    try {
      const collectionRef = collection(db, Subjects.collectionName.toString());
      const queryRes = query(collectionRef, where("schoolID", "==", schoolID));
      const snapshot = await getCountFromServer(queryRes);
      const count = snapshot.data().count;
      return count
    } catch (error) {
      console.log("Error in getSubjectCountForSchool:", error);
    }
  };
}