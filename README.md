## Node ab testing

Ab testing tool to check the performance of an HTTP service. 100 more GET request
 will be increased per second. It will not increase more request if there are more
 than 10 request not returned. It will stop when there are less than 99% request 
 return successful.

The requests number per increase round and the time of each round can be changed by user.
 
## Installation:

    sudo npm install node-ab -g 

## Usage:

    nab [URL] [--increase 100] [--milliseconds 1] [--help] [--verbose]

## Example:

    bruce➜~/src/node» nab http://localhost:81/test                                              
    REQ NUM: 200 RTN NUM: 200 QPS: 67 BODY TRAF: 33KB per second
    REQ NUM: 800 RTN NUM: 800 QPS: 134 BODY TRAF: 67KB per second
    REQ NUM: 1700 RTN NUM: 1700 QPS: 189 BODY TRAF: 94KB per second
    REQ NUM: 2900 RTN NUM: 2900 QPS: 242 BODY TRAF: 121KB per second
    REQ NUM: 4400 RTN NUM: 4400 QPS: 294 BODY TRAF: 147KB per second
    REQ NUM: 6200 RTN NUM: 6200 QPS: 345 BODY TRAF: 172KB per second

