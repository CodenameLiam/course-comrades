import {
  IconButton,
  InputAdornment,
  TextField,
  withStyles,
} from '@material-ui/core';
import * as firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Page from '../Components/Navigation/Page';
import { Search } from '@material-ui/icons';
import Note from '../Types/Note';
import TableComponent from '../Components/Table/Table';
import { filterBySearchString } from '../Services/TableService';

export default function Home() {
  const history = useHistory();
  const [topNotes, setTopNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [useFiltereNotes, setUseFilteredNotes] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [loadData, setLoadData] = useState(false);

  const user = firebase.auth().currentUser;
  const username = user?.displayName;

  const handleFilter = (notes: Note[], searchString: string) => {
    setUseFilteredNotes(true);
    const filteredNoteArray = filterBySearchString(notes, searchString);
    setFilteredNotes(filteredNoteArray);
  };

  useEffect(() => {
    fetch('/api/query/time', {
      method: 'POST',
      body: JSON.stringify({
        timePeriod: 'week',
        numResults: 10,
        username: username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data: Note[]) => setTopNotes(data))
      .catch((e) => console.log(e));
    setLoadData(false);
  }, [loadData]);

  return (
    <Page request={() => setLoadData(true)}>
      <div className="home">
        <div className="prompt">
          <p>Boost your mark!</p>
          <p>Find subject notes at UQ</p>
        </div>
        <div className="search-bar">
          <SearchTextField
            className="search"
            placeholder="Refine notes by name..."
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchString(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleFilter(topNotes, searchString)}
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
        <div className="top-notes">
          <p style={{ marginBottom: '24px' }}>Top Notes</p>
          <TableComponent notes={useFiltereNotes ? filteredNotes : topNotes} />
        </div>
      </div>
    </Page>

    // 	<Button onClick={() => logout(handleSuccess, handleError)}>Logout</Button>
    // 	<ToastContainer />
    // </div>
  );
}

export const SearchTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 100,
      boxShadow: '2px 2px 5px #dddddd',
      background: '#51247a',
      '& input': {
        background: '#ffffff',
        borderRadius: '100rem 0rem 0rem 100rem',
      },
      '& fieldset': {
        transition: 'box-shadow 0.3s',
        borderColor: '#dddddd',
      },
      '&:hover fieldset': {
        borderColor: '#dddddd',
        boxShadow: '2px 2px 10px #dddddd',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#dddddd',
        boxShadow: '2px 2px 10px #dddddd',
      },
    },
    '& .Mui-error': {
      '& fieldset': {
        transition: 'box-shadow 0.3s',
        borderColor: '#e62645',
      },
    },
  },
})(TextField);
