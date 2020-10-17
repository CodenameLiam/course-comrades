import { Button, IconButton, InputAdornment, withStyles } from "@material-ui/core";
import { NoteAdd, Search } from "@material-ui/icons";
import React from "react";
import Page from "../Components/Navigation/Page";
import { SearchTextField } from "./Home";

export default function MyNotes() {
  return (
    <Page>
      <div className="my-notes">
        <div className="title">My notes</div>
        <div className="input">
          <div className="search-notes">
            <SearchTextField
              className="search"
              placeholder="Search your notes..."
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="search"
                      style={{ color: "#ffffff" }}
                      // onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="upload-notes">
            <UploadButton
              className="login-button"
              variant="contained"
              fullWidth
              startIcon={<NoteAdd />}
            >
              Upload New Notes
            </UploadButton>
          </div>
        </div>
      </div>
    </Page>
  );
}

const UploadButton = withStyles({
  root: {
    background: "linear-gradient(171deg, rgba(81, 36, 122, 1) 0%, rgba(150, 42, 187, 1) 100%);",
    borderRadius: 100,
    height: "56px",
    color: "white",
    fontSize: "1rem",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "2px 2px 5px #c5c5c5",
    // boxShadow: "2px 4px 4px -2px #962abb",
    "&:hover": {
      boxShadow: "2px 2px 10px #989898",
      // boxShadow: "2px 5px 8px -1px #962abb",
    },
  },
})(Button);
