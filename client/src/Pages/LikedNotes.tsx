import {
  Button,
  IconButton,
  InputAdornment,
  withStyles,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import Page from '../Components/Navigation/Page';
import TableComponent from '../Components/Table/Table';
import Note from '../Types/Note';
import { SearchTextField } from './Home';
import * as firebase from 'firebase/app';
import { filterBySearchString } from '../Services/TableService';

export default function LikedNotes() {
  const [likedNotes, setLikedNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [useFiltereNotes, setUseFilteredNotes] = useState(false);
  const [searchString, setSearchString] = useState('');

  const handleFilter = (notes: Note[], searchString: string) => {
    setUseFilteredNotes(true);
    const filteredNoteArray = filterBySearchString(notes, searchString);
    setFilteredNotes(filteredNoteArray);
  };

  const handleEnterSearch = (
    e: React.KeyboardEvent<HTMLDivElement>,
    notes: Note[],
    searchString: string,
  ) => {
    if (e.key === 'Enter') {
      handleFilter(notes, searchString);
    }
  };

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
        <div className="title">Liked notes</div>
        <div className="input">
          <div className="search-notes">
            <SearchTextField
              className="search"
              placeholder="Search your notes..."
              variant="outlined"
              fullWidth
              onKeyDown={(e) => handleEnterSearch(e, likedNotes, searchString)}
              onChange={(e) => setSearchString(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleFilter(likedNotes, searchString)}
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
          <TableComponent
            notes={useFiltereNotes ? filteredNotes : likedNotes}
          />
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
