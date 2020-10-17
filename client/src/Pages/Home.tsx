import { Button } from "@material-ui/core";
import React from "react";
import { logout } from "../Services/LoginService";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Page from "../Components/Navigation/Page";

export default function Home() {
  const history = useHistory();

  const handleSuccess = () => {
    history.push("/login");
    console.log("success");
    toast.success("YEET");
  };

  const handleError = (e: any) => {
    toast.error(e.message);
    console.log(e);
  };

  return (
    <Page>Home</Page>

    // 	<Button onClick={() => logout(handleSuccess, handleError)}>Logout</Button>
    // 	<ToastContainer />
    // </div>
  );
}
