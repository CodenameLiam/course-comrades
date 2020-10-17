// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';

export const generateToken = (handleToken: (idToken: string) => void) => {
  firebase
    .auth()
    .currentUser?.getIdToken(/* forceRefresh */ true)
    .then((idToken) => handleToken(idToken))
    .then((e) => {
      console.log(e);
    });
};
