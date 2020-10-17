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
const userLikes = db.collection('user-likes');

// Handles Creating notes
app.post('/create_note', async (req, res) => {
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
      uploadDate: moment().format(),
    });

    // add an id attribute to the notes object to make it easier for the frontend
    await notesDB.doc(note.id).update({ id: note.id });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

  res.status(200).send('succesfully created note');
});

// Handles upvoting a note
app.post('/like_note', async (req, res) => {
  const fileLink = req.body.fileLink;
  const username = req.body.username;

  // Get current likes
  const currentLikes = await notesDB.doc(fileLink).get().data['likes'];
  const docRef = notesDB.doc(fileLink);

  // Updates likes
  await docRef.update({
    likes: currentLikes + 1,
  });
  if (!currentLikes.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', currentLikes.data());
    console.log(x);
  }
});

// Handles downloads counter incrementing
app.post('/download_note', async (req, res) => {
  const fileLink = req.body.fileLink;
  const currentDownloads = await notesDB.doc(fileLink).get().data['downloads'];
  const docRef = notesDB.doc(fileLink);
  // Updates downloads
  await docRef.update({
    downloads: currentDownloads + 1,
  });
});

// Server content using react clientside
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
