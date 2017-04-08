var httpLib = require('http'),
    url = require('url'),
    colors = require('colors'),
    argv = require('optimist').argv;

var stats = {
  'conn_num': 0,
  'req_num': 0,
  'success_num': 0,
  'traffic_ps': 0
};
if(argv.help || argv.h){
    console.log("Usage: nab <URL> [--increase 100] [--milliseconds 1] [--help] [--verbose]".green);
    console.log("");
    console.log("Samples:".blue);
    console.log("\tnab http://192.168.1.66");
    console.log("\tnab http://localhost");
    console.log("\tnab http://localhost:4000 --increase 200");
    console.log("\tnab http://localhost:4000 -i 200");
    console.log("\tnab http://localhost:4000 --milliseconds 1500");
    console.log("\tnab http://localhost:4000 --milliseconds 1500 --verbose");
    console.log("\tnab http://localhost:4000 -m 1500");
    console.log("\tnab http://localhost:4000 -m 1500 -v");
    console.log("\tnab --help");
    console.log("\tnab -h");
    return console.log("");
}
if(!process.argv[2]) {
  return console.log("Usage: nab <URL> [--increase 100] [--milliseconds 1] [--help] [--verbose]".red);
}
var uri = process.argv[2];
var user_option = url.parse(uri);
if(!user_option.hostname || !user_option.path) {
  return console.log("Not validate [URL]".red);
}

var useHTTPS = (user_option.protocol === 'https:');

if (useHTTPS) {
  httpLib = require('https');
}

var force = (argv.increase || argv.i) || 100; // increase request number per second
if(argv.v || argv.verbose) console.log(("Increase " + (force) + " requests per round").green);

var pre_qps = 0;
var traffic = 0;
var start = new Date().getTime();

process.on('uncaughtException', function (err) {
  // continue running
  //console.error(err.stack);
  if(argv.v || argv.verbose) console.log(("Ending connection").red);
});

var bench_intv = function() {
  // Skip when there are no return requests
  if(stats.conn_num > 10) return;

  var http_request = function() {
    var options = {
      hostname: user_option.hostname,
      port: user_option.port,
      path: user_option.path,
      method: 'GET'
    };

    if (useHTTPS) {
      options.rejectUnauthorized = false;
    }

    var callback = function(res) {
      if(res.statusCode === 200) {
        stats.success_num ++;
      }
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          if(argv.v || argv.verbose){
              console.log(("Data received").green);
              console.log(("\t"+chunk).yellow);
          }
          traffic += chunk.length;
      });
      res.on('end', function() {
          if(argv.v || argv.verbose)console.log(("Ending connection").red);
        stats.conn_num --;
      });
    };


    var req = httpLib.request(options, callback);
    req.setNoDelay(true);
    //req.setSocketKeepAlive(false);
    req.end();
  };
  for(var i=0; i< force; i++) {
    stats.req_num ++;
    stats.conn_num ++;
    http_request();
  }
};

var milliseconds = (argv.milliseconds || argv.m) || 1000;
if(argv.v || argv.verbose) console.log(("Increase requests per " + milliseconds + " milliseconds").green);
setInterval(bench_intv, milliseconds );

var stats_intv = function() {
  var qps = parseInt(stats.success_num * milliseconds / (new Date().getTime() - start), 10);
  stats.qps = qps;
  stats.force = force;
  var tps = parseInt(traffic * milliseconds / (new Date().getTime() - start), 10);
  stats.traffic_ps = btraffic(tps);
  console.log("Request number: " + stats.req_num.toString().green + " Return number: " + stats.success_num.toString().green
   + " QPS: " + stats.qps.toString().green + " Traffic: " + stats.traffic_ps.green);

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

setInterval(stats_intv, 3*milliseconds);

function btraffic(num) {
  var m = parseInt(num / 1048576, 10);
  var k = parseInt((num - m * 1048576) / 1024, 10);
  var b = parseInt(num - m * 1048576 - k * 1024, 10);
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
  if(milliseconds == 1000){
    result += 'per second';
  }else{
      result += 'every ' + (milliseconds) + ' milliseconds';
  }
  return result;
}
