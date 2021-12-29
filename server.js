var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();
var dotenv = require('dotenv');
dotenv.config();

var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({ secret: process.env.REACT_APP_FAUNA_KEY });

var Web3 = require("web3");
var web3 = new Web3();
web3.setProvider(new Web3.providers.WebsocketProvider(process.env.WEB3_ALCHEMY_API_KEY));

var abi = require("./contract-abi.json");
var address = process.env.REACT_APP_CONTRACT_ADDRESS;
var KNS = new web3.eth.Contract(abi, address);

var totalSupply = 0;

function getTotalSupply(){
    web3.eth.call({
        to: address,
        data: KNS.methods.totalSupply().encodeABI()
    }).then(function (result){
        // console.log(parseInt(result, 16))
        totalSupply = parseInt(result, 16);  
        return totalSupply;
    });
};

getTotalSupply();

// Express.router

router.param('tokenId', async function (req, res, next, tokenId) {
    console.log('Id validations on ' + tokenId);

    await getTotalSupply();
    
    if (parseInt(tokenId) <= parseInt(totalSupply)) {
        console.log("Verified successfully");
        next();
    } else {
        console.log("Someone is being naughty 🔥");
        res.send("Someone is being naughty 🔥")
    }

});

router.get('/Metadata/:tokenId', function (req, res) {
  //console.log(req.params.tokenId)
  adminClient.query(
    q.Get(q.Ref(q.Collection('Metadata'), String(req.params.tokenId)))
  )
    .then((ret) => res.json(ret.data))
    .catch((err) => console.error('Error: %s', err))
});

app.use('/', router);
app.listen(port);