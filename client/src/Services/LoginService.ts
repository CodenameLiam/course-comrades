// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';

export const register = (
  email: string,
  password: string,
  username: string,
  handleSuccess: (user: firebase.auth.UserCredential) => void,
  handleError: (e: Error) => void,
): void => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => handleSuccess(user))
    .then(() => {
      const user = firebase.auth().currentUser;
      user?.updateProfile({
        displayName: username,
      });
    })
    .catch((e) => handleError(e));
};

export const login = (
  email: string,
  password: string,
  handleSuccess: (user: firebase.auth.UserCredential) => void,
  handleError: (e: Error) => void,
): void => {
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => handleSuccess(user))
        .catch((e) => handleError(e));
    })
    .catch((e) => handleError(e));
};

export const logout = (
  handleSuccess: () => void,
  handleError: (e: Error) => void,
): void => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      handleSuccess();
    })
    .catch((e) => {
      // An error happened.
      handleError(e);
    });
};

export const auth = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// function getCurrentUser() {}
