import React from "react";
import { useParams } from "react-router";
import Page from "../Components/Navigation/Page";

interface IMatchProps {
  id: string;
}

export default function Note() {
  const params = useParams<IMatchProps>();

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
