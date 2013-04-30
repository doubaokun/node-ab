var http = require('http'),
    url = require('url'),
    colors = require('colors');

var stats = {
  'conn_num': 0,
  'req_num': 0,
  'success_num': 0,
  'traffic_ps': 0
};

if(!process.argv[2]) {
  return console.log("Usage: nab [URL]".red);
}
var uri = process.argv[2];
var user_option = url.parse(uri);
if(!user_option.hostname || !user_option.path) {
  return console.log("Not validate [URL]".red);
}

var force = 100; // increase request number per second
var pre_qps = 0;
var traffic = 0;
var start = new Date().getTime();

var bench_intv = function() {
  // Skip when there are no return requests
  if(stats.conn_num > 10) return;

  var http_request = function() {
    var options = {
      hostname: user_option.hostname,
      port: user_option.port,
      path: user_option.path + '?i='+stats.req_num,
      method: 'GET'
    };

    var callback = function(res) {
      if(res.statusCode === 200) {
        stats.success_num ++;
      }
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        traffic += chunk.length;
      });
      res.on('end', function() {
        stats.conn_num --;
      });
    };


    var req = http.request(options, callback);
    req.setNoDelay(true);
    //req.setSocketKeepAlive(false);
    req.end();
  }
  for(var i=0; i< force; i++) {
    stats.req_num ++;
    stats.conn_num ++;
    http_request();
  }
};

setInterval(bench_intv, 1000);

var stats_intv = function() {
  var qps = parseInt(stats.success_num * 1000 / (new Date().getTime() - start), 10);
  stats.qps = qps;
  stats.force = force;
  var tps = parseInt(traffic * 1000 / (new Date().getTime() - start), 10);
  stats.traffic_ps = btraffic(tps);
  console.log("REQ NUM: " + stats.req_num.toString().green + " RTN NUM: " + stats.success_num.toString().green
   + " QPS: " + stats.qps.toString().green + " BODY TRAF: " + stats.traffic_ps.green);

  if(stats.req_num - stats.success_num < 10) {
    force += 100;
  }
  if(stats.success_num/stats.req_num < 0.99) {
    process.exit();
  }
  if(stats.qps === pre_qps) {
    process.exit();
  }
  pre_qps = qps;
};

setInterval(stats_intv, 3000);

function btraffic(num) {
  var m = parseInt(num / 1000000, 10);
  var k = parseInt((num - m * 1000000) / 1000, 10);
  var b = parseInt(num - m * 1000000 - k * 1000, 10);
  var result = '';
  if(m > 0) {
    result += m + 'MB ';
  }
  if(k > 0 && !result) {
    result += k + 'KB ';
  }
  if(b > 0 && !result) {
    result += b + 'B ';
  }
  result += 'per second'
  return result;
}