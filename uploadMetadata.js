var dotenv = require('dotenv');
dotenv.config();

var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({ secret: process.env.REACT_APP_FAUNA_KEY });

// Creat FaunaDB Data
for(var i = 0; i < 1000; i++){
    num = pad(String(i));
    var creat = adminClient.query(q.Create(q.Ref(q.Collection('Metadata'), i), {data: {
        tokenId: i,
        name: "Katana N' Samurai 2.0 #" + num,
        image: "https://gateway.pinata.cloud/ipfs/QmZD1Pm5BvCgTE3WfmQYwSZ4xpsCgp9fYWwfGSkXiA9R2H"

        }
}));
}

function pad(n) {
    var s = "000" + n;
    return s.substr(s.length-4);
}
