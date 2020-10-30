// Express for server-side functionality
import express from 'express';
// Helper functions
//import helpers from './helpers.js';
// Path, fs and util for file handling
// const fs = require("fs");
// const util = require("util");
import path from 'path';
// Lodash array utils
import _ from 'lodash';

import moment from 'moment';
// Get google build storage
// import { CloudBuildClient } from '@google-cloud/cloudbuild';
// Load SwaggerUI

import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './swagger.js';
// Use your firebase private key here. Initialize our firebase account, as well as our firestore databases.
import admin from 'firebase-admin';
import serviceAccount from './firebase-admin-token.js';

// Moment for handling dates
// Define application
const app = express();

import cors from 'cors';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://uqcs-hackathon-2020.firebaseio.com',
});

export const db = admin.firestore();
const userUploadDB = db.collection('user-upload');
const notesDB = db.collection('notes');
const userLikesDB = db.collection('user-likes');
const noteLikesDB = db.collection('note-likes');
const hashtagsDB = db.collection('hashtags-notes');
const course2NotesDB = db.collection('course-notes');

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Define port
const port = 5000;

const router = express.Router();

// Serve static assets built from the clientside
// app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static('./../client/build'));
// app.use(express.static({ root: './../client/build' }));

// middleware to handle requests with json body
app.use(express.json());

// allow requests from frontend in dev
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

// Handles Creating notes
app.post('/api/create-note', async (req, res) => {
  const name = req.body.name;
  const author = req.body.author;
  const courseCode = req.body.courseCode;
  const description = req.body.description;
  const hashtags = req.body.hashtags;
  const faculty = req.body.faculty;
  const semester = req.body.semester;
  if (
    name === undefined ||
    author === undefined ||
    courseCode === undefined ||
    description === undefined ||
    hashtags === undefined ||
    faculty === undefined ||
    semester === undefined
  ) {
    res.status(400).send('Bad Request');
  }

  const uploadDate = admin.firestore.Timestamp.fromDate(new Date());
  try {
    if (
      name === undefined ||
      author === undefined ||
      courseCode === undefined ||
      description === undefined ||
      hashtags === undefined
    ) {
      throw new Error('Undefined arguments provided');
    }
    // .add() will generate a unique id in firestore
    const note = await notesDB.add({
      name: name,
      author: author,
      description: description,
      courseCode: courseCode,
      hashtags: hashtags,
      faculty: faculty,
      semester: semester,
      likes: 1,
      downloads: 0,
      // need to use firebase timestamp date objects to filter by dates
      uploadDate: uploadDate,
    });

    // add an id attribute to the notes object to make it easier for the frontend
    await notesDB.doc(note.id).update({ id: note.id });

    hashtags.forEach(function (hashtag) {
      hashtagsDB
        .doc(hashtag)
        .set({ notes: admin.firestore.FieldValue.arrayUnion(note.id) }, { merge: true });
    });

    await course2NotesDB
      .doc(courseCode)
      .set({ notes: admin.firestore.FieldValue.arrayUnion(note.id) }, { merge: true });

    await noteLikesDB.doc(note.id).set({ users: [author] });

    await userLikesDB
      .doc(author)
      .set({ notes: admin.firestore.FieldValue.arrayUnion(note.id) }, { merge: true });

    await userUploadDB
      .doc(author)
      .set({ notes: admin.firestore.FieldValue.arrayUnion(note.id) }, { merge: true });

    // const test = note.id;
    res.json({ id: note.id, message: 'Succesfully created note' });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Handles likes a note
app.post('/api/like-note', async (req, res) => {
  const noteId = req.body.noteId;
  const username = req.body.username;
  if (noteId === undefined || username === undefined) {
    res.status(400).send('Bad Request');
  }
  // Get current likes
  try {
    const currentLikes = await getCurrentLikes(req);
    const noteRef = notesDB.doc(noteId);
    const exists = await noteLikesDB.doc(noteId).get();
    if (!exists.data().users.includes(username)) {
      // Updates likes
      await noteRef.update({
        likes: currentLikes + 1,
      });

      // Adds note to userlikes and like to notelikes collections
      await userLikesDB.doc(username).set(
        {
          notes: admin.firestore.FieldValue.arrayUnion(noteId),
        },
        { merge: true },
      );

      await noteLikesDB.doc(noteId).set(
        {
          users: admin.firestore.FieldValue.arrayUnion(username),
        },
        { merge: true },
      );
      res.status(200).send('successfully liked note');
    } else {
      res.status(400).send('user has already liked note or note does not exist');
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Handles unliking a note
app.post('/api/unlike-note', async (req, res) => {
  const username = req.body.username;
  const noteId = req.body.noteId;
  if (username === undefined || noteId === undefined) {
    res.status(400).send('Bad Request');
  }
  // Get current likes
  try {
    const currentLikes = await getCurrentLikes(req);
    const noteRef = notesDB.doc(noteId);
    const exists = await noteLikesDB.doc(noteId).get();

    if (exists.data().users.includes(username)) {
      // Updates likes
      await noteRef.update({
        likes: currentLikes - 1,
      });

      // Remove note to userlikes and like to notelikes collections

      await userLikesDB.doc(username).update({
        notes: admin.firestore.FieldValue.arrayRemove(noteId),
      });

      await noteLikesDB.doc(noteId).update({
        users: admin.firestore.FieldValue.arrayRemove(username),
      });

      res.status(200).send('successfully unliked note');
    } else {
      res.status(400).send('');
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Handles downloads counter incrementing
app.post('/api/add-download', async (req, res) => {
  const noteId = req.body.noteId;
  if (noteId === undefined) {
    res.status(400).send('Bad Request');
  }
  try {
    const docRef = await notesDB.doc(noteId).get();
    const currentDownloads = docRef.data().downloads;

    // Updates downloads
    await docRef.update({
      downloads: currentDownloads + 1,
    });
    res.status(200).send('successfully added download');
  } catch (e) {
    res.status(500).send(e);
  }
});

// Query by likes and time
app.post('/api/query/time/', async (req, res) => {
  const timePeriod = req.body.timePeriod;
  const numResults = parseInt(req.query.numResults) || 100;
  const username = req.body.username;

  let fromDate = moment();
  // fromDate.setHours(0, 0, 0, 0);
  switch (timePeriod) {
    case 'day':
      fromDate = fromDate.toDate().subtract(1, 'days').toDate();
      break;
    case 'week':
      fromDate = fromDate.subtract(7, 'days').toDate();
      break;
    case 'month':
      fromDate = fromDate.subtract(31, 'days').toDate();
      break;
    case 'year':
      fromDate = fromDate.subtract(365, 'days').toDate();
      break;
    default:
      fromDate = fromDate.subtract(7, 'days').toDate();
  }

  const timestampDate = admin.firestore.Timestamp.fromDate(fromDate);
  const snapshot = await notesDB.where('uploadDate', '>=', timestampDate).get();
  const notesArray = snapshot.docs.map((doc) => doc.data());
  const sortedNotesArray = _.orderBy(notesArray, ['likes'], ['desc']).splice(-Math.abs(numResults));
  for (const note of sortedNotesArray) {
    const refDoc = await userLikesDB.doc(username).get();
    if (refDoc.exists && refDoc.data().notes.includes(note.id)) {
      note.liked = true;
    } else {
      note.liked = false;
    }
  }

  res.status(200).send(sortedNotesArray);
});

app.post('/api/get-liked-notes', async (req, res) => {
  const username = req.body.username;
  if (username === undefined) {
    res.status(400).send('Bad Request');
  }
  try {
    const docRef = await userLikesDB.doc(username).get();
    if (docRef.exists) {
      const results = await getNotes((await docRef).data().notes, username);
      res.status(200).send(results);
    } else {
      res.status(400).send('Bad Request');
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post('/api/search', async (req, res) => {
  try {
    let resultId = [];
    const faculty = req.body.faculty;
    const hashtags = req.body.hashtags;
    const semester = req.body.semester;
    const courseCode = req.body.courseCode;
    const username = req.body.username;

    console.log(faculty, hashtags, semester, courseCode);

    // const temp = await courseCodeQuery(courseCode);
    if (courseCode != undefined) {
      resultId = resultId.concat(await courseCodeQuery(courseCode));
    }
    // if (hashtags != undefined) {
    //   resultId = Array.from(new Set(resultId.concat(await hashtagQuery(hashtags))));
    // Hashtag query
    if (hashtags !== undefined) {
      const tags = await hashtagQuery(hashtags);
      resultId = resultId.concat(tags);
    }

    // Coursecode filter

    let notes = await getNotes(resultId, username);

    if (courseCode !== undefined) {
      notes = notes.filter((value) => value.courseCode === courseCode);
    }

    notes = notes.filter((note) => {
      let valid = true;
      if (semester !== undefined) {
        valid = note.semester === semester;
      }
      if (valid && faculty !== undefined) {
        valid = note.faculty === faculty;
      }
      return valid;
    });
    res.status(200).send(notes);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Get note
app.post('/api/get-note', async (req, res) => {
  const id = [req.body.id];
  const username = req.body.username;
  const notes = await getNotes(id, username);
  res.status(200).send(notes[0]);
});

// Get uploaded notes by a user
app.post('/api/get-uploaded', async (req, res) => {
  const username = req.body.username;
  if (!username) {
    res.status(400).send('Bad request, undefined username');
  }
  try {
    const docRef = await userUploadDB.doc(username).get();
    if (!docRef.exists) {
      res.status(200).send([]);
    }
    const userNotes = await getNotes(docRef.data().notes, username);
    res.status(200).send(userNotes);
  } catch (e) {}
});

app.post('/api/get-hashtags', async (req, res) => {
  const docRef = await hashtagsDB.listDocuments();
  const hashtags = docRef.map((it) => it.id);
  console.log(hashtags);
  res.status(200).send(hashtags);
});

app.post('/api/get-courses', async (req, res) => {
  const docRef = await course2NotesDB.listDocuments();
  const courses = docRef.map((it) => it.id);
  res.status(200).send(courses);
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('api/deploy/ping', (req, res) => {
  console.log('Ping received');
  res.status(200).send('Ping received');
});

// Below are all the helper functions used

// Returns an array of note JSON objects from an array of note ID's
const getNotes = async (noteIds, username) => {
  const result = [];
  let likeFlag = false;
  for (const noteId of noteIds) {
    const docRef = await notesDB.doc(noteId).get();
    if (docRef.exists) {
      const likeRef = await userLikesDB.doc(username).get();
      if (likeRef.exists) {
        if (likeRef.data().notes.includes(noteId)) {
          likeFlag = true;
        }
      }

      const noteData = docRef.data();
      result.push({
        name: noteData.name,
        author: noteData.author,
        description: noteData.description,
        courseCode: noteData.courseCode,
        hashtags: noteData.hashtags,
        likes: noteData.likes,
        downloads: noteData.downloads,
        uploadDate: noteData.uploadDate,
        id: noteId,
        faculty: noteData.faculty,
        semester: noteData.semester,
        liked: likeFlag,
      });
    }
    if (!!username) {
      likeFlag = true;
    } else {
    }
  }
  return result;
};

const getCurrentLikes = async (req) => {
  const noteId = req.body.noteId;
  const docRef = await notesDB.doc(noteId).get();
  return await docRef.data().likes;
};

// Query by hashtag
const hashtagQuery = async (hashtags) => {
  try {
    const noteIds = [];
    for (const hashtag of hashtags) {
      const docRef = await hashtagsDB.doc(hashtag).get();
      if (docRef.exists) {
        const notes = docRef.data().notes;

        notes.forEach((noteID) => {
          noteIds.push(noteID);
        });
      }
    }
    return noteIds;
  } catch (e) {
    console.log(e);
  }
};

//Gets the note id's of notes with specified course code
const courseCodeQuery = async (courseCode) => {
  try {
    const docRef = await course2NotesDB.doc(courseCode).get();
    if (docRef.exists) {
      const notes = docRef.data().notes;
      return notes;
    } else {
      return [];
    }
  } catch (e) {
    console.log(e);
    return [];
  }
};

// Server content using react clientside
app.get('/', (req, res) => {
  // path.join(__dirname, '../client/build', 'index.html')
  try {
    res.sendFile('index.html', { root: './../client/build' });
    // res.sendFile(path.join(__dirname, '../client/build') + 'index.html');
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
export default class server {}
