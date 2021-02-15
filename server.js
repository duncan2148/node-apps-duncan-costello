require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  const id = () => {
    return Math.floor(Math.random() * 10)
  }
  if(result){
    res.json({ original_url: url, short_url: id() });
  } else {
    res.json({ "error": "invalid url" });
  }

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
 