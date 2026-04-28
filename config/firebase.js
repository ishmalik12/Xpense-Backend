"use strict";

const admin = require("firebase-admin");

// load from JSON file
const serviceAccount = require("./serviceAccount.json");

// initialize once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();
const messaging = admin.messaging();

module.exports = { db, auth, messaging };