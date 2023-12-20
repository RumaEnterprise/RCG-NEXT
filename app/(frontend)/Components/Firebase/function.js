import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAuth,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./Firebase";
initializeApp(firebaseConfig);
export const gAuth = getAuth();
const logIn = (email, password) =>
  signInWithEmailAndPassword(gAuth, email, password);

const signUp = (email, password) =>
  createUserWithEmailAndPassword(gAuth, email, password);

const logOut = () => signOut(gAuth);

const googleSignIn = () => {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(gAuth, googleAuthProvider);
};

const setUpRecaptha = (number) => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier(
      gAuth,
      "recaptcha-container",
      { size: "invisible" }
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(gAuth, number, recaptchaVerifier);
  } catch (error) {
    console.log(error);
  }
};

const verifyOTP = (data, code) => {
  try {
    const data_credential = PhoneAuthProvider.credential(
      data.verificationId,
      code
    );
    console.log(data_credential)
    signInWithCredential(gAuth, data_credential)
      .then((userCredential) => {
        return userCredential;
      })
      .catch((error) => {
        // Verification failed
        console.error("Verification failed", error);
      });
  } catch (error) {
    console.log(error);
  }
};
export { setUpRecaptha, googleSignIn, logOut, logIn, signUp, verifyOTP };
