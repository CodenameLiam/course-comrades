import { TableRow, TableCell } from "@material-ui/core";
import * as firebase from "firebase/app";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Note from "../../Types/Note";
import moment from "moment";
import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import { download } from "../../Services/FileService";
import { useHistory } from "react-router";

type RowComponentProps = {
  note: Note;
};

const Row = (props: RowComponentProps) => {
  const { note } = props;

  const history = useHistory();

  const [likes, setLikes] = useState<number | undefined>(undefined);
  const [liked, setLiked] = useState(note.liked);

  const user = firebase.auth().currentUser;
  const username = user?.displayName;

  const likePost = (e: any, username: string, noteId: string): void => {
    // console.log("");
    e.stopPropagation();
    if (liked !== true) {
      fetch("/api/like-note", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          noteId: noteId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          console.log("hello");
          setLikes(note.likes + 1);
          setLiked(true);
        })
        .catch((e) => console.log(e));
    }
  };

  const downloadPost = (e: any) => {
    e.stopPropagation();
    download(note.id, note.name);
  };
  // onClick={() => history.push(`/note/${note.id}`)}
  return (
    <TableRow key={note.id} onClick={() => history.push(`/note/${note.id}`)}>
      <TableCell component="th" scope="row">
        {note.name}
      </TableCell>
      <TableCell align="center">{note.courseCode}</TableCell>
      <TableCell align="center">{note.author}</TableCell>
      <TableCell align="center">{note.hashtags.join(", ")}</TableCell>
      <TableCell align="center">
        {moment(new Date(parseInt(note.uploadDate._seconds) * 1000)).format("DD/MM/YYYY, HH:mm")}
      </TableCell>
      <TableCell align="center">{likes || note.likes}</TableCell>
      <TableCell align="center">
        <IconButton onClick={(e) => likePost(e, username as string, note.id)}>
          <ThumbUpIcon {...(liked ? { style: { fill: "green" } } : {})} />
        </IconButton>
      </TableCell>
      <TableCell align="center">
        <IconButton onClick={(e) => downloadPost(e)}>
          <CloudDownloadIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default Row;
