require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const bodyParser = require('body-parser');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async function(req, res) {
    // gets the code from the frontend
    await fetch(`https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`, {  
        method: "POST",
        headers: {
            "Accept" : "application/json"
        }
    })
        .then((response) => response.json())
        .then((data) => {
        // returns the access token obtained from github
        res.json(data);
    });
});

app.get('/getUserData', async function (req, res) {
    console.log(req.get("Authorization")); 
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization" : req.get("Authorization")
        }
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            res.json(data);
    });
});

app.listen(4000, function() {
    console.log("cors server running on port 4000");
});