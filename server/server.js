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

// Server content using react clientside
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
