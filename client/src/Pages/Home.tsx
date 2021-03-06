import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  withStyles,
} from '@material-ui/core';
import * as firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Page from '../Components/Navigation/Page';
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
  const [timePeriod, setTimePeriod] = useState('');

  const handleFilter = (notes: Note[], searchString: string) => {
    setUseFilteredNotes(true);
    const filteredNoteArray = filterBySearchString(notes, searchString);
    setFilteredNotes(filteredNoteArray);
  };

  const user = firebase.auth().currentUser;
  const username = user?.displayName;

  useEffect(() => {
    fetch('/api/query/time', {
      method: 'POST',
      body: JSON.stringify({
        timePeriod: timePeriod,
        numResults: 100,
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
  }, [loadData, timePeriod]);

  return (
    <Page request={() => setLoadData(true)}>
      <div className="home">
        {/* <div className="prompt">
					<p>Boost your mark!</p>
					<p>Find subject notes at UQ</p>
				</div>
				<div className="search-bar">
					<SearchTextField
						className="search"
						placeholder="Search..."
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
				</div> */}
        <div className="top-notes">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            <p>Top Notes</p>
            <FormControl style={{ minWidth: '120px' }}>
              <InputLabel id="time-period-select-label">Time Period</InputLabel>
              <Select
                labelId="time-period-label-id"
                id="time-period-select"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as string)}
              >
                <MenuItem value={'day'}>day</MenuItem>
                <MenuItem value={'week'}>week</MenuItem>
                <MenuItem value={'month'}>month</MenuItem>
                <MenuItem value={'year'}>year</MenuItem>
              </Select>
            </FormControl>
          </div>

          <TableComponent notes={topNotes} />
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
