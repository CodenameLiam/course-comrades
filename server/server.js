// Express for server-side functionality
import express from 'express';
// Helper functions
//import helpers from './helpers.js';
// Path, fs and util for file handling
// const fs = require("fs");
// const util = require("util");
import path from 'path';
// Define application
const app = express();

// Use your firebase private key here. Initialize our firebase account, as well as our firestore databases.
import admin from "firebase-admin";
import serviceAccount from './firebase-admin-token.js';

// Moment for handling dates
import moment from "moment";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://uqcs-hackathon-2020.firebaseio.com',
});

export const db = admin.firestore();
const userSavedDB = db.collection('user-saved');
const notesDB = db.collection('notes');
const userLikesDB = db.collection('user-likes');
const noteLikesDB = db.collection('note-likes');
const hashtagsDB = db.collection('hashtags-notes');
const course2NotesDB = db.collection('course-notes');
const notes2facultyDB = db.collection('note-faculty');

// Define port
const port = 5000;

// Serve static assets built from the clientside
app.use(express.static('../client/build'));

// middleware to handle requests with json body
app.use(express.json());


// Handles Creating notes
app.post('/api/create_note', async (req, res) => {

  const name = req.body.name;
  const author = req.body.author;
  const courseCode = req.body.courseCode;
  const description = req.body.description;
  const hashtags = req.body.hashtags;
  const faculty = req.body.faculty;
  const semester = req.body.semester;

  try {
    if (name === undefined || author === undefined || courseCode === undefined || description === undefined
        || hashtags === undefined) {
      throw new Error("Undefined arguments provided");
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
      likes: 0,
      downloads: 0,
      uploadDate: moment().format()
    });

    // add an id attribute to the notes object to make it easier for the frontend
    await notesDB.doc(note.id).update({id: note.id});

    hashtags.forEach(function (hashtag) {
      console.log(hashtag);
      hashtagsDB.doc(hashtag).set({notes: db.FieldValue.arrayUnion(note.id)}, {merge: true});
    });

    await course2NotesDB.doc(courseCode).set({notes: db.FieldValue.arrayUnion(note.id)}, {merge: true});
    await course2NotesDB.doc(courseCode).set({notes: db.FieldValue.arrayUnion(note.id)}, {merge: true});

  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

  res.status(200).send('succesfully created note');
});


// Handles likes a note
app.post('/api/like_note', async (req, res) => {
  const noteId = req.body.noteId;
  const username = req.body.username;
  // Get current likes
  try {
    const currentLikes = helpers.getCurrentLikes(req);
    const noteRef = notesDB.doc(noteId);

    // Updates likes
    await noteRef.update({
      likes: currentLikes + 1,
    });

    // Adds note to userlikes and like to notelikes collections

    await userLikesDB.doc(username).update({
      notes: db.FieldValue.arrayUnion(noteId)
    })

    await noteLikesDB.doc(username).update({
      users: db.FieldValue.arrayUnion(username)
    })

    res.status(200).send('successfully liked note');
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Handles unliking a note
app.post('/api/unlike_note', async (req, res) => {
  const username = req.body.username;
  const noteId = req.body.noteId;
  // Get current likes
  try {
    const currentLikes = helpers.getCurrentLikes(req);
    const noteRef = notesDB.doc(noteId);

    // Updates likes
    await noteRef.update({
      likes: currentLikes - 1,
    });

    // Remove note to userlikes and like to notelikes collections

    await userLikesDB.doc(username).update({
      notes: db.FieldValue.arrayRemove(noteId)
    })

    await noteLikesDB.doc(username).update({
      users: db.FieldValue.arrayRemove(username)
    })

    res.status(200).send('successfully liked note');
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

});

// Handles downloads counter incrementing
app.post('/api/add_download', async (req, res) => {

  const noteId = req.body.noteId;
  try {
    const docRef = notesDB.doc(noteId);
    const currentDownloads = await docRef.data['downloads'];

    // Updates downloads
    await docRef.update({
      downloads: currentDownloads + 1,
    });
    res.status(200).send('successfully added download');
  } catch (e) {
    res.status(500).send(e);
  }
});


// // Add a saved note for a user
// app.post('api/save-note', async (req, res) => {
//   try {
//
//   } catch (e) {
//
//   }
// })

app.get('/api/search', async (req, res) => {
  const faculty = req.body.faculty;
  const hashtags = req.body.hashtags;
  const semester = req.body.semester;
  const courseCode = req.body.courseCode;
  console.log(faculty, hashtags, semester, courseCode);
  console.log(helpers.courseCodeQuery(courseCode));
})

// Server content using react clientside
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const getNotes = async(noteIds) => {
  var result = [];
  noteIds.forEach( function (noteId){
    const noteData = notesDB.doc(noteId).get().data();
    result.push(
        {
          name: noteData['name'],
          author: noteData['author'],
          description: noteData['description'],
          courseCode: noteData['courseCode'],
          hashtags: noteData['hashtags'],
          likes: noteData['likes'],
          downloads: noteData['downloads'],
          uploadDate: noteData['uploadDate'],
          noteId : noteId
        }
    );
  })
  return result;
}

const getCurrentLikes = async (req) => {
  const noteId = req.body.noteId;
  // Get current likes
  return  await notesDB.doc(noteId).get().data['likes'];
}

// Query by hashtag
const hashtagQuery =  async (hashtags) => {
  try {
    var noteIds = [];
    hashtags.forEach((hashtag) => {
      const notes = (hashtagsDB.doc(hashtag).get()).data()['notes']
      notes.forEach((noteID) => {
        noteIds.push(noteID);
      })
    })
    return noteIds;
  } catch (e) {

  }
};

const courseCodeQuery = async (courseCode) => {
  try {
    var noteIds = [];
    var notes = await course2NotesDB.doc(courseCode).get().data()['notes']
    return noteIds;
  }
  catch (e){
  }
}

// Filter by semester, takes in array of notes, not id's
const semesterQuery = async (semester, notes) =>{
  const results = [];
  notes.forEach((note)=>{
    if (note.semester === semester){
      results.push(note);
    }
  })
  return results;
}

// Filter by faculty, takes in array of notes, not id's
const facultyQuery = async (query, notes) =>{
  const results = [];
  notes.forEach((note)=>{
    if (note.query === query){
      results.push(note);
    }
  })
  return results;
}

app.listen(port, () => console.log(`Server started on port ${port}`));
