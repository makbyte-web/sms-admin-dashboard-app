import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { Users } from "./users";
import { standards, divisions, subjects } from "@/defaults";
import { Standards } from "./standard";
import { Divisions } from "./division";
import { Subjects } from "./subject";
export class Schools {
  static collectionName = "schools";

  constructor(schoolName, location, medium, indexNo, email, urlDP, createdDate, createdBy, updatedDate, updatedBy, displayName=null, photoURL=null, phoneNumber=null, schoolID='new', userID='new') {
    this.schoolName = schoolName;
    this.location = location;
    this.medium = medium;
    this.indexNo=indexNo
    this.email = email;
    this.urlDP = urlDP;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.schoolID = schoolID,
    this.userID = userID,
    this.displayName = displayName;
    this.photoURL = photoURL;
    this.phoneNumber = phoneNumber
  }

  addSchool = async () => {
    try {
      const newData = {
        schoolName: this.schoolName,
        location: this.location,
        medium: this.medium,
        indexNo: this.indexNo,
        email: this.email,
        urlDP: this.urlDP,
        contactNo: this.phoneNumber,
        userID : this.userID,  
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };

      const userData = {
        email: this.email,
        schoolName: this.schoolName, 
        displayName: this.displayName,
        photoURL: this.photoURL,
        phoneNumber: this.phoneNumber
      }

      // addUser
      const newUser = new Users(userData.email, userData.schoolName, userData.displayName, userData.photoURL, userData.phoneNumber)
      newData.userID = await newUser.addUser()
      // console.log(`User ${newData.userID} created.`);

      // addSchool
      const docRef = await addDoc(collection(db, Schools.collectionName.toString()), { ...newData });
      // console.log("School added with ID:", docRef?.id);

      let retval
      const addedSchoolID = docRef?.id
      const loggedInUserID = newData?.userID

      //add default standard
      const stdList = [];
      Object.keys(standards).forEach((standard) =>
        stdList.push(standards[standard])
      );

      let newDefaultStd;
      Object.keys(standards).forEach(async (standard) => {
        newDefaultStd = new Standards(
          addedSchoolID,
          standards[standard],
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newDefaultStd.addStandard()
        // console.log(`Standard ${standards[standard]} added for school ${addedSchoolID}`)
        newDefaultStd = null;
      });
      retval=null

      //adding default division
      const divList = [];
      Object.keys(divisions).forEach((division) =>
        divList.push(divisions[division])
      );

      let newDefaultDiv;
      Object.keys(divisions).forEach(async (division) => {
        newDefaultDiv = new Divisions(
          addedSchoolID,
          divisions[division],
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newDefaultDiv.addDivision();
        // console.log(`Standard ${divisions[division]} add for school ${addedSchoolID}`)
        newDefaultDiv = null;
      });
      retval=null

      //adding default subjects
      let newDefaultSub;
      subjects.forEach(async (subject) => {
        newDefaultSub = new Subjects(
          addedSchoolID,
          subject,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newDefaultSub.addSubject();
        // console.log(`Subject ${subject} added for school ${addedSchoolID}`)
        newDefaultSub = null;
      });
      retval=null

      return true;
    } catch (error) {
      console.log("Error in addNewSchool:", error);
    }
  };

  updateSchool = async () => {
    try {
      const schoolID = this.schoolID;
      const newData = {
        schoolName: this.schoolName,
        location: this.location,
        medium: this.medium,
        indexNo: this.indexNo,
        email: this.email,
        urlDP: this.urlDP,
        contactNo: this.phoneNumber,
        userID : this.userID,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };

      const userData = {
        email: this.email,
        schoolName: this.schoolName, 
        displayName: this.displayName,
        photoURL: this.photoURL,
        phoneNumber: this.phoneNumber
      }

      // updateUser
      const existsingUser = new Users(userData.email, userData.schoolName, userData.displayName, userData.photoURL, userData.phoneNumber)
      const updatedUser = await existsingUser.updateUser()
      // console.log(`User ${updatedUser} updated.`);

      // updateSchool
      const docRef = doc(db, Schools.collectionName.toString(), schoolID);
      await updateDoc(docRef, { ...newData });
      // console.log(`School ${schoolID} updated`);

      return true;
    } catch (error) {
      console.log("Error in updateSchool:", error);
    }
  };

  static deleteSchool = async (schoolID) => {
    try {
      await deleteDoc(doc(db, Schools.collectionName.toString(), schoolID));
      // console.log(`School ${schoolId} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteSchool:", error);
    }
  };

  static getSchools = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, Schools.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ schoolID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getSchools:", error);
    }
  };

  static getSchoolsOwnedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Schools.collectionName.toString()), where("userID", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ schoolID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getSchoolsOwnedByUser:", error);
    }
  };

  static getSchool = async (schoolID) => {
    try {
      const docRef = doc(db, Schools.collectionName.toString(), schoolID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No School found with ${schoolID}!`
      }
    } catch (error) {
      console.log("Error in getSchool By ID:", error);
    }
  };

  static getSchoolByUserID = async (userID) => {
    try {
      const data = []
      const queryRes = query(collection(db, Schools.collectionName.toString()), where("userID", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
       data.push({ schoolID: doc.id, ...doc.data()});
      });
      if (data.length) {
        return data && data[0]
      } else {
        return `No School created by ${userID}!`
      }
    } catch (error) {
      console.log("Error in getSchool By ID:", error);
    }
  };
}