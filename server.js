require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortid = require('shortid');
//const mongo = require('mongodb');
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const Schema = mongoose.Schema;
let ShortURL = mongoose.model("ShortURL", new Schema({
  "short_url": String,
  "original_url": String,
  "suffix": String
}))
// middleware and basic setup
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(__dirname + "/public"));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/url-shortener', function(req, res) {
  res.sendFile(__dirname + '/views/url-shortener.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
// shorturl endpoint
app.post('/api/shorturl/new', (req, res)=>{
  const {url} = req.body
  let validate = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
  let result = validate.test(url)
 
  let suffix = shortid.generate();
  let baseURL = url;
  let short = suffix
  if(result){
     let newURL = new ShortURL({
       short_url: "/api/shorturl/" + suffix,
       original_url: baseURL,
       suffix: suffix,
     });
     newURL.save((err, data) => {
       if (err) {
         console.log(err);
       }
       res.json({
         original_url: newURL.original_url,
         short_url: newURL.short_url,
         suffix: newURL.suffix,
       });
     });
  } else {
    res.json({error: "invalid url"})
  }
   
})
  app.get("/api/shorturl/:suffix", (req, res) => {
    const { suffix } = req.params;
    let userRequestedURL = suffix;
    ShortURL.find({ suffix: userRequestedURL }).then((foundUrls) => {
      let redir = foundUrls[0].original_url;
      res.redirect(redir);
    });

  });
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
 