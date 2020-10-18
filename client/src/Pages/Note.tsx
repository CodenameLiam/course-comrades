import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Page from "../Components/Navigation/Page";
import axios from "axios";
import * as firebase from "firebase/app";
import "firebase/storage";
import { Document, Page as DocumentPage } from "react-pdf";
import { pdfjs } from "react-pdf";
interface IMatchProps {
  id: string;
}

export default function Note() {
  const params = useParams<IMatchProps>();
  const user = firebase.auth().currentUser;
  const username = user?.displayName;

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [note, setNote] = useState<any>(undefined);
  const [file, setFile] = useState<string | undefined>(undefined);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const storageRef = firebase.storage().ref();
  // storageRef.child(`notes/${noteId}/${noteName}.pdf`).getDownloadURL();

  useEffect(() => {
    axios.post("/api/get-note", { username: username, id: params.id }).then((d) => {
      setNote(d.data);
    });
    // return () => {
    //   // console.log(d.data);
    // };
  }, []);

  useEffect(() => {
    console.log("Here i am");
    if (note) {
      storageRef
        .child(`notes/${note.id}/${note.name}.pdf`)
        .getDownloadURL()
        .then((url) => {
          // setFile(url);
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function (event) {
            const blob = xhr.response;
            console.log("Trying to log blob:");
            console.log(blob);
            // saveAs(blob, `${noteName}.pdf`);
          };
          xhr.open("GET", url);
          console.log(xhr);
          // console.log("url is");
          console.log(url);
        });
    }
    // console.log(storageRef);
    // return () => {
    //   cleanup;
    // };
  }, [note]);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  //   console.log(params.id);
  return (
    <Page>
      <div className="note">
        <div className="left">
          {file ? (
            <>
              <Document
                file={`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <DocumentPage pageNumber={pageNumber} />
              </Document>
              <p>
                Page {pageNumber} of {numPages}
              </p>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="right">Right</div>
      </div>
    </Page>
  );
}
