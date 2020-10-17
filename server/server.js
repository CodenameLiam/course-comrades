// Express for server-side functionality
const express = require('express');

// Path, fs and util for file handling
// const fs = require("fs");
// const util = require("util");
const path = require('path');

// Define application
const app = express();

// Use your firebase private key here. Initialize our firebase account, as well as our firestore databases.
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-token.json');

// Moment for handling dates
const moment = require('moment');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://uqcs-hackathon-2020.firebaseio.com',
});

// Define port
const port = 5000;

// Serve static assets built from the clientside
app.use(express.static('../client/build'));

// middleware to handle requests with json body
app.use(express.json());

const db = admin.firestore();
const usersDB = db.collection('users');
const notesDB = db.collection('notes');
const userLikesDB = db.collection('user-likes');
const noteLikesDB = db.collection('note-likes');
const hashtagsDB = db.collection('hashtags-notes');

// Handles Creating notes
app.post('/api/create_note', async (req, res) => {
  const name = req.body.name;
  const author = req.body.author;
  const courseCode = req.body.courseCode;
  const description = req.body.description;
  const hashtags = req.body.hashtags;
  try {
    // .add() will generate a unique id in firestore
    const note = await notesDB.add({
      name: name,
      author: author,
      description: description,
      courseCode: courseCode,
      hashtags: hashtags,
      likes: 0,
      downloads: 0,
      uploadDate: moment().format()
    });

    // add an id attribute to the notes object to make it easier for the frontend
    await notesDB.doc(note.id).update({id: note.id});

    hashtags.forEach(function (hashtag){
      hashtagsDB.doc(hashtag).set({notes: admin.firestore.FieldValue.arrayUnion(note.id)}, {merge: true})
    })


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
    const currentLikes = getCurrentLikes(req);
    const noteRef = notesDB.doc(noteId);

    // Updates likes
    await noteRef.update({
      likes: currentLikes + 1,
    });

    // Adds note to userlikes and like to notelikes collections

    await userLikesDB.doc(username).update({
      notes: admin.firestore.FieldValue.arrayUnion(noteId)
    })

    await noteLikesDB.doc(username).update({
      users: admin.firestore.FieldValue.arrayUnion(username)
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
      const currentLikes = getCurrentLikes(req);
      const noteRef = notesDB.doc(noteId);

      // Updates likes
      await noteRef.update({
        likes: currentLikes - 1,
      });

      // Remove note to userlikes and like to notelikes collections

      await userLikesDB.doc(username).update({
        notes: admin.firestore.FieldValue.arrayRemove(noteId)
      })

      await noteLikesDB.doc(username).update({
        users: admin.firestore.FieldValue.arrayRemove(username)
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

// Query by hastag
  app.get('/api/query/hashtag', async (req, res) =>{
    try {

    }
    catch (e){
      res.status(500).send(e);
    }
  })



// Server content using react clientside
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });

  var getCurrentLikes = async (req) => {
    const noteId = req.body.noteId;
    // Get current likes
    const currentLikes = await notesDB.doc(noteId).get().data['likes'];
  }



  app.listen(port, () => console.log(`Server started on port ${port}`));
