import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  withStyles,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React, { useState } from 'react';
import Page from '../Components/Navigation/Page';
import TableComponent from '../Components/Table/Table';
import Note from '../Types/Note';
import * as firebase from 'firebase/app';

export default function SearchNotes() {
  const [searchedNotes, setSearchedNotes] = useState<Note[]>([]);

  const user = firebase.auth().currentUser;
  const username = user?.displayName;

  const search = () => {
    fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data: Note[]) => setSearchedNotes(data))
      .catch((e) => console.log(e));
  };

  return (
    <Page>
      <div className="my-notes">
        <Paper>
          <div className="input">
            <div className="search-notes">
              <TextField
                className="search"
                placeholder="Search your notes..."
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="search"
                        style={{ color: '#ffffff' }}
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
          </div>
        </Paper>

        <div className="notes">
          <TableComponent notes={searchedNotes} />
        </div>
      </div>
    </Page>
  );
}

const UploadButton = withStyles({
  root: {
    background:
      'linear-gradient(171deg, rgba(81, 36, 122, 1) 0%, rgba(150, 42, 187, 1) 100%);',
    borderRadius: 100,
    height: '56px',
    color: 'white',
    fontSize: '1rem',
    fontFamily: "'Poppins', sans-serif",
    boxShadow: '2px 2px 5px #c5c5c5',
    // boxShadow: "2px 4px 4px -2px #962abb",
    '&:hover': {
      boxShadow: '2px 2px 10px #989898',
      // boxShadow: "2px 5px 8px -1px #962abb",
    },
  },
})(Button);
