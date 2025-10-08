import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export class Holiday {
  static collectionName = "holiday";

  constructor(schoolID, academicYear, occasion, dayOfWeek, holidayType, holidayDate, endDate, createdDate, createdBy, updatedDate, updatedBy, holidayID='new') {
    this.schoolID = schoolID;
    this.academicYear = academicYear;
    this.occasion = occasion;
    this.dayOfWeek = dayOfWeek;
    this.holidayType = holidayType;
    this.holidayDate = holidayDate;
    this.endDate = endDate;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.holidayID = holidayID;
  }

  addHoliday = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        occasion: this.occasion,
        dayOfWeek:this.dayOfWeek,
        holidayType: this.holidayType,
        holidayDate: this.holidayDate,
        endDate: this.endDate,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = await addDoc(collection(db, Holiday.collectionName.toString()), { ...newData });
      // console.log("Holiday added with ID:", docRef?.id);
      return docRef?.id;
    } catch (error) {
      console.log("Error in addNewHoliday:", error);
    }
  };

  updateHoliday = async () => {
    try {
      const holidayID = this.holidayID;
      const newData = {
        schoolID: this.schoolID,
        academicYear: this.academicYear,
        occasion: this.occasion,
        dayOfWeek:this.dayOfWeek,
        holidayType: this.holidayType,
        holidayDate: this.holidayDate,
        endDate: this.endDate,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy
      };
      const docRef = doc(db, Holiday.collectionName.toString(), holidayID);
      await updateDoc(docRef, { ...newData });
      // console.log(`Holiday ${holidayID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateHoliday:", error);
    }
  };

  static deleteHoliday = async (holidayID) => {
    try {
      await deleteDoc(doc(db, Holiday.collectionName.toString(), holidayID));
      // console.log(`Holiday ${holidayID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteHoliday:", error);
    }
  };

  static getHoliday = async () => {
    try {
      const data = [];
      const querySnapshot = await getDocs(collection(db, Holiday.collectionName.toString()));
      querySnapshot.forEach((doc) => {
        data.push({ holidayID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getHoliday:", error);
    }
  };

  static getHolidayCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Holiday.collectionName.toString()), where("createdBy", "==", userID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ holidayID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getHolidayCreatedByUser:", error);
    }
  };

  static getHolidayBySchool = async (schoolID, academicYear) => {
    try {
      const data = [];
      const queryRes = query(collection(db, Holiday.collectionName.toString()), where("schoolID", "==", schoolID));
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ holidayID: doc.id, ...doc.data() });
      });
      const holidayBySchool = data.filter((holiday) => holiday.academicYear === academicYear)
      if (holidayBySchool?.length) return holidayBySchool
    } catch (error) {
      console.log("Error in getHolidayBySchool:", error);
    }
  };

  static getHoliday = async (holidayID) => {
    try {
      const docRef = doc(db, Holiday.collectionName.toString(), holidayID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data
      } else {
        return `No Holiday found with ${holidayID}!`
      }
    } catch (error) {
      console.log("Error in getHoliday By ID:", error);
    }
  };
  
}