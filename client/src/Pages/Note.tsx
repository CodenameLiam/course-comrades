import React, { useEffect } from "react";
import { useParams } from "react-router";
import Page from "../Components/Navigation/Page";
import axios from "axios";
import * as firebase from "firebase/app";
interface IMatchProps {
  id: string;
}

export default function Note() {
  const params = useParams<IMatchProps>();
  const user = firebase.auth().currentUser;
  const username = user?.displayName;

  useEffect(() => {
    axios.post("/api/get-note", { username: username, id: params.id }).then((d) => {
      console.log(d.data);
    });
    // return () => {
    //   // console.log(d.data);
    // };
  }, []);

  //   console.log(params.id);
  return (
    <Page>
      <div className="note">
        <div className="left">Left</div>
        <div className="right">Right</div>
      </div>
    </Page>
  );
}
