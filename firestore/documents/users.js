import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"

export class Users {
  // static collectionName = "users"; //we are using user from Authentication

  constructor(email, password, displayName=null, photoURL=null, phoneNumber=null) {
    this.email = email;
    this.password = `${password.split(' ')[0].toLowerCase()}@1234`;
    this.displayName = displayName;
    this.photoURL = photoURL;
    this.phoneNumber = phoneNumber;
  }

  addUser = async () => {
    try {
      const email = this.email
      const password = this.password
      const displayName = this.displayName
      const photoURL = this.photoURL
      const phoneNumber = this.phoneNumber

      const auth = getAuth()
      
      // user creation in Authentication
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // add user other details by updateProfile
      if(result?.user) {
        await updateProfile(auth.currentUser, {"displayName": displayName, "photoURL": photoURL, "phoneNumber": phoneNumber})
      }
      
      if (result) return result?.user?.uid;
    } catch (error) {
      console.log("Error in addUser:", error);
    }
  };

  updateUser = async () => {
    try {

      const displayName = this.displayName
      const photoURL = this.photoURL
      const phoneNumber = this.phoneNumber

      const auth = getAuth()

      // updateProfile
      await updateProfile(auth.currentUser, {"displayName": displayName, "photoURL": photoURL, "phoneNumber": phoneNumber})

      return auth?.currentUser?.uid;
    } catch (error) {
      console.log("Error in addUser:", error);
    }
  };

  static getUser = async (userID) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user !== null) {
        const userData = { displayName: user.displayName, email: user.email, photoURL: user.photoURL, phoneNumber: user.phoneNumber, userID: user.uid } 
        return userData;
      } else {
        return `No User found with ${userID}!`
      }
    } catch (error) {
      console.log("Error in getUser By ID:", error);
    }
  };

}