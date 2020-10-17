import {
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from '@material-ui/core';
import * as firebase from 'firebase/app';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Note from '../../Types/Note';
import moment from 'moment';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Row from './Row';

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
          {notes.map((note: Note, index) => (
            <Row note={note} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
