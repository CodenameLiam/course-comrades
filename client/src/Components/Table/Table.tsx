import {
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import * as firebase from "firebase/app";
import Note from "../../Types/Note";
import React, { useEffect, useState } from "react";
import Row from "./Row";

type TableComponentProps = {
  notes: Note[];
};

const TableComponent = (props: TableComponentProps) => {
  const { notes } = props;
  return (
    <TableContainer
      component={Paper}
      className="note-table"
      style={{ boxShadow: "2px 2px 5px #dddddd" }}
    >
      <Table className="table" aria-label="top notes">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Course</TableCell>
            <TableCell align="center">Author</TableCell>
            <TableCell align="center">Hashtags</TableCell>
            <TableCell align="center">Date Uploaded</TableCell>
            <TableCell align="center">Likes</TableCell>
            <TableCell align="center">{""}</TableCell>
            <TableCell align="center">{""}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notes.map((note: Note) => (
            <Row note={note} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
