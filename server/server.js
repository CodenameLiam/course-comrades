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
app.use(express.static(path.join(__dirname, '../client/build')));

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
      console.log(hashtag);
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
      .set(
        { notes: admin.firestore.FieldValue.arrayUnion(note.id) },
        { merge: true },
      );

    await userUploadDB
      .doc(author)
      .set(
        { notes: admin.firestore.FieldValue.arrayUnion(note.id) },
        { merge: true },
      );

  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

  res.status(200).send('succesfully created note');
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
  const timePeriod = req.query.timePeriod;
  const numResults = parseInt(req.query.numResults) || 100;

  const fromDate = new Date();
  fromDate.setHours(0, 0, 0, 0);
  switch (timePeriod) {
    case 'day':
      break;
    case 'week':
      fromDate.setDate(fromDate.getDate - 7);
      break;
    case 'month':
      fromDate.setDate(fromDate.getDate - 31);
      break;
    case 'year':
      fromDate.setDate(fromDate.getDate - 365);
      break;
  }

  const timestampDate = admin.firestore.Timestamp.fromDate(fromDate);
  const snapshot = await notesDB.where('uploadDate', '>=', timestampDate).get();
  const notesArray = snapshot.docs.map((doc) => doc.data());
  const sortedNotesArray = _.orderBy(notesArray, ['likes'], ['desc']).splice(-Math.abs(numResults));

  res.status(200).send(sortedNotesArray);
});

app.post('api/get-liked-notes', async (req, res) => {
  const username = req.body.username;
  if (username === undefined) {
    res.status(400).send('Bad Request');
  }
  try {
    const docRef = userLikesDB.doc(username).get();
    if ((await docRef).exists) {
      const results = await getNotes((await docRef).data().notes);
      res.status(200).send();
    } else {
      res.status(400).send('Bad Request');
    }
  } catch (e) {
    res.status(500).send(e);
  }

});

app.get('/api/search', async (req, res) => {
  try {
    let resultId = [];
    const faculty = req.body.faculty;
    const hashtags = req.body.hashtags;
    const semester = req.body.semester;
    const courseCode = req.body.courseCode;
    console.log(faculty, hashtags, semester, courseCode);

    const temp = await courseCodeQuery(courseCode);
    if (courseCode !== undefined) {
      resultId = resultId.concat(await courseCodeQuery(courseCode));
    }
    if (hashtags !== undefined) {
      resultId = Array.from(new Set(resultId.concat(await hashtagQuery(hashtags))));
    }

    let notes = await getNotes(resultId);

    notes = notes.filter((note) => {
      let valid = true;
      if (semester !== undefined) {
        valid = note.semester === semester;
      }
      if (valid && faculty !== undefined) {
        valid = note.faculty === faculty;
      }
      console.log(valid);
      return valid;
    });
    console.log(notes);

    res.status(200).send(res);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// Below are all the helper functions used

// Returns an array of note JSON objects from an array of note ID's
const getNotes = async (noteIds, username) => {
  const result = [];
  for (const noteId of noteIds) {
    const docRef = await notesDB.doc(noteId).get();
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
      noteId: noteId,
      faculty: noteData.faculty,
      semester: noteData.semester,
    });
  }
  return result;
};

app.use('/api/get-uploaded',async (req, res) =>{
  const username = req.body.username;
  if (!username){
    res.status(400).send('Bad request, undefined username');
  }
  try{
    const docRef = await userUploadDB.doc(username).get();
    if (!docRef.exists){
      res.status(200).send('[]');
    }
    res.status(200).send(getNotes(docRef.data().notes))
  }
  catch (e){

  }


})

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
  if (req.accept('html')) secres.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
export default class server {}
