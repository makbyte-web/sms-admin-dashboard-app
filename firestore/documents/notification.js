import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class Notifications {
  static collectionName = "notifications";

  constructor(schoolID, academicYear, sender, heading, message, intendedFor, stdID, divID, status, createdDate, createdBy, updatedDate, updatedBy, notificationID = "new") {
    this.schoolID = schoolID;
    this.academicYear = academicYear;
    this.sender = sender;
    this.heading = heading;
    this.message = message;
    this.intendedFor = intendedFor;
    this.stdID = stdID;
    this.divID = divID;
    this.status = status;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.notificationID = notificationID;
  }

  addNotification = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        sender: this.sender,
        heading: this.heading,
        message: this.message,
        intendedFor: this.intendedFor,
        stdID: this.stdID,
        divID: this.divID,
        status: this.status,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = await addDoc(collection(db, Notifications.collectionName.toString()), { ...newData });
      // console.log("Notifications added with ID:", docRef?.id);
      return docRef?.id;
    } catch (error) {
      console.log("Error in addNotification:", error);
    }
  };

  updateNotification = async () => {
    try {
      const notificationID = this.notificationID;
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        sender: this.sender,
        heading: this.heading,
        message: this.message,
        intendedFor: this.intendedFor,
        stdID: this.stdID,
        divID: this.divID,
        status: this.status,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, Notifications.collectionName.toString(), notificationID);
      await updateDoc(docRef, { ...newData });
      // console.log(`Notifications ${notificationID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateNotification:", error);
    }
  };

  static deleteNotification = async (notificationID) => {
    try {
      await deleteDoc(doc(db, Notifications.collectionName.toString(), notificationID));
      // console.log(`Notifications ${notificationID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteNotification:", error);
    }
  };

  static getNotifications = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, Notifications.collectionName.toString()));
      const data = [];
      querySnapshot.forEach((doc) => {
         data.push({ notificationID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getNotifications:", error);
    }
  };

  static getNotificationsCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, Notifications.collectionName.toString()),
        where("createdBy", "==", userID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ notificationID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getNotificationsCreatedByUser:", error);
    }
  };

  static getNotificationsBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, Notifications.collectionName.toString()),
        where("schoolID", "==", schoolID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ notificationID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getNotificationsBySchool:", error);
    }
  };

  static getNotification = async (notificationID) => {
    try {
      const docRef = doc(db, Notifications.collectionName.toString(), notificationID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data;
      } else {
        return `No Notification found with ${notificationID}!`;
      }
    } catch (error) {
      console.log("Error in getNotification By ID:", error);
    }
  };
}
