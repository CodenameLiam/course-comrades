// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';

export const login = (
  email: string,
  password: string,
  handleSuccess: (user: firebase.auth.UserCredential) => void,
  handleError: (e: Error) => void,
): void => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => handleSuccess(user))
    .catch((e) => handleError(e));
};

export const register = (
  email: string,
  password: string,
  handleSuccess: (user: firebase.auth.UserCredential) => void,
  handleError: (e: Error) => void,
): void => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => handleSuccess(user))
    .catch((e) => handleError(e));
};
