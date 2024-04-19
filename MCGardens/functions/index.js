const functions = require('firebase-functions');
const appPlant = require('./askGpt');
const appCrops = require('./optimalCrops');

exports.askGpt = functions.https.onRequest(appPlant);
exports.askOptimalCrops = functions.https.onRequest(appCrops);
