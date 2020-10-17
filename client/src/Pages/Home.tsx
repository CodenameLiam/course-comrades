import {
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TextField,
  withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { logout } from '../Services/LoginService';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Page from '../Components/Navigation/Page';
import { Search } from '@material-ui/icons';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Note from '../Types/Note';
import moment from 'moment';

export default function Home() {
  const history = useHistory();
  const [topNotes, setTopNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch('/api/query/time', {
      method: 'POST',
      body: JSON.stringify({
        timePeriod: 'week',
        numResults: 10,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data: Note[]) => setTopNotes(data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <Page>
      <div className="home">
        <div className="prompt">
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
          <p>Top Notes</p>
          <TableContainer component={Paper}>
            <Table className="table" aria-label="top notes">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Course Code</TableCell>
                  <TableCell align="center">Date Uploaded</TableCell>
                  <TableCell align="center">Likes</TableCell>
                  <TableCell align="center">{''}</TableCell>
                  <TableCell align="center">{''}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topNotes.map((note: Note, index) => {
                  return (
                    <TableRow key={note.id}>
                      <TableCell component="th" scope="row">
                        {note.name}
                      </TableCell>
                      <TableCell align="center">{note.courseCode}</TableCell>
                      <TableCell align="center">
                        {moment(
                          new Date(parseInt(note.uploadDate._seconds) * 1000),
                        ).format('DD/MM/YYYY, HH:mm')}
                      </TableCell>
                      <TableCell align="center">{note.likes}</TableCell>
                      <TableCell align="center">
                        <ThumbUpIcon />
                      </TableCell>
                      <TableCell align="center">
                        <CloudDownloadIcon />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
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
