import {
  Button,
  IconButton,
  InputAdornment,
  withStyles,
} from '@material-ui/core';
import { NoteAdd, Search } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import Page from '../Components/Navigation/Page';
import TableComponent from '../Components/Table/Table';
import Note from '../Types/Note';
import { SearchTextField } from './Home';
import * as firebase from 'firebase/app';

export default function LikedNotes() {
  const [likedNotes, setLikedNotes] = useState<Note[]>([]);

  const user = firebase.auth().currentUser;
  const username = user?.displayName;

  useEffect(() => {
    fetch('/api/get-liked-notes', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data: Note[]) => setLikedNotes(data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <Page>
      <div className="my-notes">
        <div className="title">liked notes</div>
        <div className="input">
          <div className="search-notes">
            <SearchTextField
              className="search"
              placeholder="Refine table by note name..."
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
          <div className="upload-notes"></div>
        </div>
        <div className="notes">
          <TableComponent notes={likedNotes} />
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
