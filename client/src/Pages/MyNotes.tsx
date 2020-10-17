import {
  Button,
  IconButton,
  InputAdornment,
  withStyles,
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { NoteAdd, Search } from "@material-ui/icons";
import React from "react";
import Popup from "reactjs-popup";
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
            <Popup
              trigger={
                <UploadButton
                  className="login-button"
                  variant="contained"
                  fullWidth
                  startIcon={<NoteAdd />}
                >
                  Upload New Notes
                </UploadButton>
              }
              modal
              // closeOnDocumentClick={false}
            >
              <div>Popup content here !!</div>
            </Popup>
          </div>
        </div>
        <div className="notes">
          <TableContainer component={Paper}>
            <Table className="table" aria-label="top notes">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Course Code</TableCell>
                  <TableCell align="center">Date Uploaded</TableCell>
                  <TableCell align="center">Likes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {state.map((user, index) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell component="th" scope="row">
                        {index}
                      </TableCell>
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">{user.firstName}</TableCell>
                      <TableCell align="center">{user.lastName}</TableCell>
                      <TableCell align="center">{getGroups(user.groups)}</TableCell>
                    </TableRow>
                  );
                })} */}
              </TableBody>
            </Table>
          </TableContainer>
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
