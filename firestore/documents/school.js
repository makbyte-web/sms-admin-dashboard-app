import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { Users } from "./users";
import { standards, divisions, subjects } from "@/defaults";
import { Standards } from "./standard";
import { Divisions } from "./division";
import { Subjects } from "./subject";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export class Schools {
  static collectionName = "schools";

  constructor(schoolName, location, medium, indexNo, email, urlDP, urlDPID, urlAdminDPID, createdDate, createdBy, updatedDate, updatedBy, displayName = null, photoURL = null, phoneNumber = null, isActive = true, schoolID = 'new', userID = 'new') {
    this.schoolName = schoolName;
    this.location = location;
    this.medium = medium;
    this.indexNo = indexNo
    this.email = email;
    this.urlDP = urlDP;
    this.urlDPID = urlDPID;
    this.urlAdminDPID = urlAdminDPID;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.schoolID = schoolID,
    this.userID = userID,
    this.displayName = displayName;
    this.photoURL = photoURL;
    this.phoneNumber = phoneNumber
    this.isActive = isActive
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
        urlDPID: this.urlDPID,
        urlAdminDPID: this.urlAdminDPID,
        contactNo: this.phoneNumber,
        userID: this.userID,
        isActive: this.isActive,
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
      retval = null

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
      retval = null

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
      retval = null

      //login again as superadmin
      const auth = getAuth()

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

      try {
        const result = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

        localStorage.setItem("userID", JSON.stringify(result?.user?.uid));
      } catch (error) {
        console.log(`Re-login error from addSchool: ${error.message}`);
      }

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
        urlDPID: this.urlDPID,
        urlAdminDPID: this.urlAdminDPID,
        contactNo: this.phoneNumber,
        userID: this.userID,
        isActive: this.isActive,
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

      if (userData?.displayName !== "NA" && userData?.photoURL !== "NA") {
        // updateUser
        const existsingUser = new Users(userData?.email, userData?.schoolName, userData?.displayName, userData?.photoURL, userData?.phoneNumber)
        const updatedUser = await existsingUser.updateUser()
        // console.log(`User ${updatedUser} updated.`);
      }

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
      // delete standard
      await this.deleteCollectionFromSchool(schoolID, "standards");

      // delete division
      await this.deleteCollectionFromSchool(schoolID, "divisions");

      // delete subject
      await this.deleteCollectionFromSchool(schoolID, "subjects");

      // delete teachers
      await this.deleteCollectionFromSchool(schoolID, "teachers");

      // delete parents
      await this.deleteCollectionFromSchool(schoolID, "parents");

      // delete students
      await this.deleteCollectionFromSchool(schoolID, "students");

      // delete classTeacher
      await this.deleteCollectionFromSchool(schoolID, "classTeacher");

      // delete parentStudentLink
      await this.deleteCollectionFromSchool(schoolID, "parentStudents");

      // delete parentFCMToken
      await this.deleteCollectionFromSchool(schoolID, "parentFCMToken");

      // delete feestype
      await this.deleteCollectionFromSchool(schoolID, "feesType");

      // delete feesStructure
      await this.deleteCollectionFromSchool(schoolID, "feesStructure");

      // delete feesMapping
      await this.deleteCollectionFromSchool(schoolID, "feesMapping");

      // delete notifications
      await this.deleteCollectionFromSchool(schoolID, "notifications");

      // delete holidays
      await this.deleteCollectionFromSchool(schoolID, "holiday");

      // delete attendance
      await this.deleteCollectionFromSchool(schoolID, "attendance");

      // delete schoolSettings
      await this.deleteCollectionFromSchool(schoolID, "schoolSettings")

      // delete school
      await deleteDoc(doc(db, Schools.collectionName.toString(), schoolID));
      console.log(`School ${schoolID} deleted successfully!`);

      return true;
    } catch (error) {
      console.log("Error in deleteSchool:", error);
    }
  };

  static getSchools = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, Schools.collectionName.toString()));
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
        data.push({ schoolID: doc.id, ...doc.data() });
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

  static deleteCollectionFromSchool = async (schoolID, collectionName) => {
    try {
      const queryRes = query(collection(db, collectionName), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      const size = querySnapshot.size

      if (size > 0) {
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, collectionName, document.id))
        });
        console.log(`Total ${size} records deleted from ${collectionName} of School ${schoolID}`);
      } else {
        console.log(`No records found in ${collectionName} for School ${schoolID}`);
      }

      return true;
    } catch (error) {
      console.log("Error in deleteCollectionFromSchool:", error);
    }
  };
}