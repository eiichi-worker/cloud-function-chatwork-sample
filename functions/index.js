const functions = require('firebase-functions')
const express = require('express')
const bodyParser = require('body-parser');
const crypto = require('crypto')
const postChatworkMessage = require('post-chatwork-message')

const app = express()

// [Node.js express 4.xでLINE Messaging APIを利用したBOTを開発しはじめる - Qiita](https://qiita.com/kawasako3/items/79b84d344feb726ec567)
app.use(bodyParser.json({
  verify(req,res,buf) {
    req.rawBody = buf.toString()
  }
}));

var config = require('./.env.json')
// console.log(config.chatwork.api_token)
// console.log(config.chatwork.webhook_token)

// Webhook用
app.post('/webhook', (req, res) => {

  console.log("body")
  console.log(req.rawBody)
  console.log(req.body)
  console.log("body")

  if (isValidSignature(config.chatwork.webhook_token, req.get('X-ChatWorkWebhookSignature'), req.rawBody)) {
    console.log('valid signature!!')
    res.status(200)
  } else {
    console.log('not valid signature ><')
    res.status(403)
  }

  res.send()
})
// postChatworkMessage(config.chatwork.api_token, 33805597, 'Hello, World')

const api = functions.https.onRequest(app)
module.exports = {api}

/**
 * [チャットワークのWebhookの署名検証を各言語で実装してみた - ChatWork Creator's Note](http://creators-note.chatwork.com/entry/2017/11/22/165516)
 */
function isValidSignature (token, requestSignature, requestBody) {
  const hmac = crypto.createHmac('sha256', Buffer.from(token, 'base64'))
  const expectedSignature = hmac.update(requestBody).digest('base64')

  return requestSignature === expectedSignature
}
