import {
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from '@material-ui/core';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Note from '../../Types/Note';
import moment from 'moment';
import React from 'react';

type TableComponentProps = {
  notes: Note[];
};

const TableComponent = (props: TableComponentProps) => {
  const { notes } = props;
  return (
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
          {notes.map((note: Note, index) => {
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
  );
};

export default TableComponent;
