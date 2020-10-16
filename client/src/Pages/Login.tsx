import React from "react";
import { TextField, Button, FormControl, withStyles } from "@material-ui/core";

export default function Login() {
  return (
    <div className="login">
      <div className="left" />
      <div className="right">
        <div className="welcome-field">Welcome</div>
        <div className="welcome-underline" />
        <form className="form" onSubmit={() => alert("Yeah lad")}>
          <LoginTextField
            className="username"
            placeholder="Username"
            variant="outlined"
            fullWidth
          />
          <LoginTextField
            className="password"
            placeholder="Password"
            variant="outlined"
            fullWidth
          />
        </form>
        {/* <div className="form-container"></div> */}
      </div>
    </div>
  );
}

const LoginTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 100,
      marginBottom: "1rem",
      boxShadow:
        "-1px 4px 2px -2px rgba(150, 42, 187,0.3), -1px 2px 2px 0px rgba(150, 42, 187, 0.14), 0px 1px 5px 0px rgba(150, 42, 187,0.12)",

      "& fieldset": {
        transition: "box-shadow 0.3s",
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
        boxShadow:
          "-1px 3px 6px -1px rgba(150, 42, 187,0.3), -1px 4px 5px 0px rgba(150, 42, 187,0.14), 0px 1px 10px 0px rgba(150, 42, 187,0.12)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
        boxShadow:
          "-1px 3px 6px -1px rgba(150, 42, 187,0.3), -1px 4px 5px 0px rgba(150, 42, 187,0.14), 0px 1px 10px 0px rgba(150, 42, 187,0.12)",
      },
    },
    "& .Mui-error": {
      "& fieldset": {
        transition: "box-shadow 0.3s",
        borderColor: "transparent !important",
        boxShadow:
          "-1px 4px 2px -2px rgba(252,107,122,0.4), -1px 2px 2px 0px rgba(252,107,122, 0.3), 0px 1px 5px 0px rgba(252,107,122,0.2)",
      },
    },
  },
})(TextField);

export const LoginTextFieldOLD = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 100,
      boxShadow:
        "-1px 4px 2px -2px rgba(113,210,245,0.3), -1px 2px 2px 0px rgba(113,210,245, 0.14), 0px 1px 5px 0px rgba(113,210,245,0.12)",

      "& fieldset": {
        transition: "box-shadow 0.3s",
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
        boxShadow:
          "-1px 3px 6px -1px rgba(113,210,245,0.3), -1px 4px 5px 0px rgba(113,210,245,0.14), 0px 1px 10px 0px rgba(113,210,245,0.12)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
        boxShadow:
          "-1px 3px 6px -1px rgba(113,210,245,0.3), -1px 4px 5px 0px rgba(113,210,245,0.14), 0px 1px 10px 0px rgba(113,210,245,0.12)",
      },
    },
    "& .Mui-error": {
      "& fieldset": {
        transition: "box-shadow 0.3s",
        borderColor: "transparent !important",
        boxShadow:
          "-1px 4px 2px -2px rgba(252,107,122,0.4), -1px 2px 2px 0px rgba(252,107,122, 0.3), 0px 1px 5px 0px rgba(252,107,122,0.2)",
      },
    },
  },
})(TextField);
