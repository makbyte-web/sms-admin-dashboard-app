import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class Parents {
  static collectionName = "parents";

  constructor(parentName, qualification, email, password, sceretQts, sceretAns, noOfChildren, address, contact, urlDP, createdDate, createdBy, updatedDate, updatedBy, schoolID='new', parentID='new') {
    this.parentName = parentName;
    this.qualification = qualification;
    this.email = email;
    this.password = password;
    this.sceretQts = sceretQts;
    this.sceretAns = sceretAns;
    this.noOfChildren = noOfChildren;
    this.address = address;
    this.contact = contact;
    this.urlDP = urlDP;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.schoolID = schoolID;
    this.parentID = parentID;
  }

  addParent = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        parentName: this.parentName,
        qualification : this.qualification,
        email: this.email,
        password: this.password,
        sceretQts: this.sceretQts,
        sceretAns: this.sceretAns,
        noOfChildren: this.noOfChildren,
        address: this.address,
        contact: this.contact,
        urlDP: this.urlDP,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, Parents.collectionName.toString()), { ...newData });
      //console.log("Parent added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addNewParent:", error);
    }
  };

  updateParent = async () => {
    try {
      const parentID = this.parentID;
      const newData = {
        schoolID: this.schoolID,
        parentName: this.parentName,
        qualification : this.qualification,
        email: this.email,
        password: this.password,
        sceretQts: this.sceretQts,
        sceretAns: this.sceretAns,
        noOfChildren: this.noOfChildren,
        address: this.address,
        contact: this.contact,
        urlDP: this.urlDP,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, Parents.collectionName.toString(), parentID);
      await updateDoc(docRef, { ...newData });
      // console.log(`Parent ${parentID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateParent:", error);
    }
  };

  static deleteParent = async (parentID) => {
    try {
      await deleteDoc(doc(db, Parents.collectionName.toString(), parentID));
      // console.log(`Parent ${parentID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteParent:", error);
    }
  };

  static getParents = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, Parents.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ parentID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParents:", error);
    }
  };

  static getParentsCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Parents.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ parentID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParentsCreatedByUser:", error);
    }
  };

  static getParentsBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Parents.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ parentID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getParentsBySchool:", error);
    }
  };

  static getParent = async (parentID) => {
    try {
      const docRef = doc(db, Parents.collectionName.toString(), parentID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No Parent found with ${parentID}!`
      }
    } catch (error) {
      console.log("Error in getParent By ID:", error);
    }
  };
}