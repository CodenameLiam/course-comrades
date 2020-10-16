// Express for server-side functionality
const express = require("express");

// Axios for API requests
const axios = require("axios");

// Path, fs and util for file handling
// const fs = require("fs");
// const util = require("util");
const path = require("path");

// Define application
const app = express();

// Use your firebase private key here. Initialize our firebase account, as well as our firestore databases.
var admin = require("firebase-admin");
var serviceAccount = require("./firebase-admin-token.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://uqcs-hackathon-2020.firebaseio.com"
});
const db = admin.firestore();
const usersDB = db.collection("users");
const notesDB = db.collection("notes");
const userLikes = db.collection("userLikes");

// Define port
const port = 5000;

// Serve static assets built from the clientside
app.use(express.static("../client/build"));

// Serve static assets in the public folder from the clientside
// app.use(express.static("../client/public"));


// Handles Creating notes
app.post('/create_note', async (req, res) => {
    const name = req.query.name;
    const fileLink = req.query.fileLink;
    const courseCode = req.query.courseCode;
    const author = req.query.author;
    const hashtags = JSON.parse(req.query.hashtags);
    console.log(name, fileLink, courseCode, author, hashtags);

    const docRef = notesDB.doc(fileLink);
    await docRef.set({
        name: name,
        fileLink: fileLink,
        courseCode: courseCode,
        author: author,
        hashtags: hashtags,
        likes: 0,
        downloads: 0,
        uploadDate: Date.now()
    });

})

// Handles upvoting a note
app.post('/like_note', async (req, res) => {
    const fileLink = req.query.fileLink;
    const username = req.query.username;

    // Get current likes
    const currentLikes = await notesDB.doc(fileLink).get().data["likes"];
    const docRef = notesDB.doc(fileLink);

    // Updates likes
    await docRef.update({
        likes: currentLikes + 1
    });
    if (!currentLikes.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', currentLikes.data());
        console.log(x);
    }
})

// Handles downloads
app.post('/download_note', async(req, res) =>{
    const fileLink = req.query.fileLink;
    const currentDownloads = await notesDB.doc(fileLink).get().data["downloads"];
    const docRef = notesDB.doc(fileLink);
    // Updates downloads
    await docRef.update({
        downloads: currentDownloads + 1
    });
})


// Server content using react clientside
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
