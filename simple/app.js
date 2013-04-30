var express = require('express');
var app = express();

app.get('/test', function(req, res) {
  var body = '';
  for(var i=0;i<100;i++) {
    body += 'aaaaa';
  }
  res.end(body);
});

app.listen(3000);
