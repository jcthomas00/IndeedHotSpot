const admin = require('firebase-admin');
var serviceAccount = require('./indeedhotspot-firebase-adminsdk-8840m-92976e16e1.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore().collection('IndeedHotSpot');

module.exports = db;