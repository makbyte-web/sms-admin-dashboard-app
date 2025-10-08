import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

export class ParentFCMToken {
  static collectionName = "parentFCMToken";

  constructor(
    schoolID,
    parentID,
    fcmToken,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
    parentFCMTokenID = "new"
  ) {
    this.schoolID = schoolID;
    this.parentID = parentID;
    this.fcmToken = fcmToken;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.parentFCMTokenID = parentFCMTokenID;
  }

  addParentFCMToken = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        parentID: this.parentID,
        fcmToken: this.fcmToken,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = await addDoc(
        collection(db, ParentFCMToken.collectionName.toString()),
        { ...newData }
      );
      //console.log("ParentFCMToken added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addParentFCMToken:", error);
    }
  };

  updateParentFCMToken = async () => {
    try {
      const parentFCMTokenID = this.parentFCMTokenID;
      const newData = {
        schoolID: this.schoolID,
        parentID: this.parentID,
        fcmToken: this.fcmToken,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(
        db,
        ParentFCMToken.collectionName.toString(),
        parentFCMTokenID
      );
      await updateDoc(docRef, { ...newData });
      // console.log(`ParentFCMToken ${parentFCMTokenID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateParentFCMToken:", error);
    }
  };

  static deleteParentFCMToken = async (parentFCMTokenID) => {
    try {
      await deleteDoc(
        doc(db, ParentFCMToken.collectionName.toString(), parentFCMTokenID)
      );
      // console.log(`ParentFCMToken ${parentFCMTokenID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteParentFCMToken:", error);
    }
  };

  static getParentFCMTokens = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, ParentFCMToken.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ parentFCMTokenID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParentFCMToken:", error);
    }
  };
  static getParentFCMTokensCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, ParentFCMToken.collectionName.toString()),
        where("createdBy", "==", userID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ parentFCMTokenID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParentFCMTokenCreatedByUser:", error);
    }
  };

  static getParentFCMTokensBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, ParentFCMToken.collectionName.toString()),
        where("schoolID", "==", schoolID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ parentFCMTokenID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParentFCMTokenBySchool:", error);
    }
  };

  static getParentFCMToken = async (parentFCMTokenID) => {
    try {
      const docRef = doc(
        db,
        ParentFCMToken.collectionName.toString(),
        parentFCMTokenID
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data;
      } else {
        return `No ParentFCMToken found with ${parentFCMTokenID}!`;
      }
    } catch (error) {
      console.log("Error in getParentFCMToken By ID:", error);
    }
  };

  static getParentFCMTokenByParentID = async (parentID) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, ParentFCMToken.collectionName.toString()),
        where("parentID", "==", parentID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ parentFCMTokenID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParentFCMToken By ParentID:", error);
    }
  };
}
