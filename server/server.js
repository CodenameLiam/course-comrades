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

var admin = require("firebase-admin");

var serviceAccount = require("./firebase-admin-token.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://uqcs-hackathon-2020.firebaseio.com"
});
// Define port
const port = 5000;

// Serve static assets built from the clientside
app.use(express.static("../client/build"));

// Serve static assets in the public folder from the clientside
// app.use(express.static("../client/public"));





// Handles Creating notes, does not handle null as an input
app.post('/create_note', function (req,res){
    const name = req.query.name;
    const fileLink = req.query.fileLink;
    const courseCode = req.query.courseCode;
    const author = req.query.author;
    const hashtags = req.query.hashtags;
    console.log(name, fileLink, courseCode, author, hashtags[0], hashtags[2]);
    console.log(req.body)
})

// Server content using react clientside
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
