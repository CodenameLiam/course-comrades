import {
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TablePagination,
  makeStyles,
} from "@material-ui/core";
import Note from "../../Types/Note";
import React, { useEffect, useState } from "react";
import Row from "./Row";

type TableComponentProps = {
  notes: Note[];
};

// const useStyles = makeStyles({
//   container: {
//     maxHeight: "100%",
//   },
// });

const TableComponent = (props: TableComponentProps) => {
  const { notes } = props;
  // const classes = useStyles();

  return (
    <>
      <TableContainer className={"note-table"} component={Paper}>
        <Table stickyHeader className="table" aria-label="top notes">
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
    </>
  );
};

export default TableComponent;
