import { db } from "@/lib/firebase";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { deleteCloudinaryImage } from "@/actions/file";
import { defaultUrlDP } from "@/defaults";

export class Teachers {
  static collectionName = "teachers";

  constructor(teacherName, email, password, sceretQts, sceretAns, qualification, urlDP, cloudinaryImageId, createdDate, createdBy, updatedDate, updatedBy, schoolID = "new", teacherID = "new") {
    this.teacherName = teacherName;
    this.email = email;
    this.password = password;
    this.sceretQts = sceretQts;
    this.sceretAns = sceretAns;
    this.qualification = qualification;
    this.urlDP = urlDP;
    this.cloudinaryImageId = cloudinaryImageId || ""; 
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.schoolID = schoolID;
    this.teacherID = teacherID;
  }

  addTeacher = async () => {
    try {
      const newData = {
        schoolID: this.schoolID,
        teacherName: this.teacherName,
        email: this.email,
        password: this.password,
        sceretQts: this.sceretQts,
        sceretAns: this.sceretAns,
        qualification: this.qualification,
        urlDP: this.urlDP,
        cloudinaryImageId: this.cloudinaryImageId, 
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = await addDoc(
        collection(db, Teachers.collectionName.toString()),
        { ...newData }
      );
      // console.log("Teachers added with ID:", docRef?.id);
      return true;
    } catch (error) {
      console.log("Error in addNewTeacher:", error);
    }
  };

  updateTeacher = async () => {
    try {
      const teacherID = this.teacherID;
      const newData = {
        schoolID: this.schoolID,
        teacherName: this.teacherName,
        email: this.email,
        password: this.password,
        sceretQts: this.sceretQts,
        sceretAns: this.sceretAns,
        qualification: this.qualification,
        urlDP: this.urlDP,
        cloudinaryImageId: this.cloudinaryImageId,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        updatedDate: this.updatedDate,
        updatedBy: this.updatedBy,
      };
      const docRef = doc(db, Teachers.collectionName.toString(), teacherID);
      await updateDoc(docRef, { ...newData });
      // console.log(`Teacher ${teacherID} updated`);
      return true;
    } catch (error) {
      console.log("Error in updateTeacher:", error);
    }
  };

  static deleteTeacher = async (teacherID) => {
    try {
      const docRef = doc(db, Teachers.collectionName, teacherID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const teacher = docSnap.data();

        if (
          teacher.cloudinaryImageId &&
          teacher.urlDP !== defaultUrlDP 
        ) {
          await deleteCloudinaryImage(teacher.cloudinaryImageId);
        }
      }

      await deleteDoc(docRef);
      // console.log(`Teacher ${teacherID} deleted`);
      return true;
    } catch (error) {
      console.log("Error in deleteTeacher:", error);
    }
  };



  static getTeachers = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, Teachers.collectionName.toString())
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ teacherID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getTeachers:", error);
    }
  };

  static getTeachersCreatedByUser = async (userID) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, Teachers.collectionName.toString()),
        where("createdBy", "==", userID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ teacherID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getTeachersCreatedByUser:", error);
    }
  };

  static getTeachersBySchool = async (schoolID) => {
    try {
      const data = [];
      const queryRes = query(
        collection(db, Teachers.collectionName.toString()),
        where("schoolID", "==", schoolID)
      );
      const querySnapshot = await getDocs(queryRes);
      querySnapshot.forEach((doc) => {
        data.push({ teacherID: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.log("Error in getTeachersBySchool:", error);
    }
  };

  static getTeacher = async (teacherID) => {
    try {
      const docRef = doc(db, Teachers.collectionName.toString(), teacherID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data;
      } else {
        return `No Teacher found with ${teacherID}!`;
      }
    } catch (error) {
      console.log("Error in getTeacher By ID:", error);
    }
  };
}
