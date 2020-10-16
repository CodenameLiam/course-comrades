import * as firebase from 'firebase/app';
import 'firebase/storage';

// You should wrap this in a try catch
export const upload = (
  file: File,
  noteId: string,
  noteName: string,
  handleSuccess: (val: firebase.storage.UploadTaskSnapshot) => void,
) => {
  const storageRef = firebase.storage().ref();
  const noteRef = storageRef.child(`notes/${noteId}/${noteName}.pdf`);
  noteRef.put(file).then((snapshot) => handleSuccess(snapshot));
};

export const download = (noteId: string, noteName: string) => {
  const storageRef = firebase.storage().ref();
  storageRef
    .child(`notes/${noteId}/${noteName}.pdf`)
    .getDownloadURL()
    .then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (event) {
        const blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    });
};
