var express = require('express')
var app = express();
var path= require('path')
var cors = require('cors')
var functions = require('./functions.ts')

app.use(cors())
app.use(express.json())

app.post("/send", functions.sendMail)
app.get("/statistics", functions.getStatistics)

app.use(express.static(path.join(__dirname,'..' ,'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'..' ,'build', 'index.html'));
});

app.listen(3000,()=>{console.log("listening on 3000")})
