var cluster = require('cluster');
var numCPUs = /*require('os').cups().length*/ 8;
var express = require('express');

if(cluster.isMaster) { 
  for(var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  console.log("Server started http://127.0.0.1:4000/test");
} else {
  var app = express();

  app.get('/test', function(req, res) {
    var body = '';
    for(var i=0;i<100;i++) {
      body += 'aaaaa';
    }
    res.end(body);
  });

  app.listen(4000);

}
