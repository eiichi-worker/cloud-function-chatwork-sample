const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// const functions = require('firebase-functions');
const express = require("express");
const postChatworkMessage = require('post-chatwork-message')
var crypto = require('crypto');

const app = express();

var config = require('./.env.json');
console.log(config.chatwork.api_token);
console.log(config.chatwork.webhook_token);

var webhookSecretKey = Buffer.from(config.chatwork.webhook_token, 'base64').toString();
console.log(webhookSecretKey);

const hmac = crypto.createHmac('sha256', webhookSecretKey);

// // Webhook用
app.post('/webhook', (req, res) => {

    // リクエストの署名検証
    // if (req.get('X-ChatWorkWebhookSignature') === req.query.chatwork_webhook_signature) {
    //     const expectedSignature = hmac.update(requestBody).digest('base64');
    //     if (expectedSignature !== req.get('X-ChatWorkWebhookSignature')) {
    //         res.status(404)
    //     }
    // }

    postChatworkMessage(config.chatwork.api_token, 33805597, req.body)



  // データを返却
  res.send(JSON.stringify(users));
});
// postChatworkMessage(config.chatwork.api_token, 33805597, 'Hello, World')


const api = functions.https.onRequest(app);
module.exports = { api };
