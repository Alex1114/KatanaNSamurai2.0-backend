var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();
var dotenv = require('dotenv');
dotenv.config();

var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({
    secret: process.env.REACT_APP_FAUNA_SIGN_KEY
});

// adminClient.query(
//     q.CreateIndex({
//       name: 'Claim_Address',
//       source: q.Collection('Claim'),  
//       terms: [
//         { field: ["data", "address"] }
//       ]
//     })
//   )
//   .then((ret) => console.log(ret))
//   .catch((err) => console.error('Error: %s', err))


adminClient.query(
    q.Map(q.Paginate(q.Match(q.Index("Claim_Address"), "0xbd42A2035D41b450eE7106C9F9C0C736fb546226")),
        q.Lambda(
          "signature",
          q.Get(q.Var("signature"))
        )))
    .then((ret) => console.log(ret.data[0].data.signature))
    .catch((err) => console.error('Error: %s', err))

