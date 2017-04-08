## Node ab testing

Automatically benchmarking the performance of HTTP services.

## How it works
Ab testing tool to check the performance of an HTTP service. 100 more GET request will be increased per second. It will not increase more request if there are more than 10 request not returned. It will stop when there are less than 99% request return successful.

The requests number per increase round and the time of each round can be changed by user.
 
## Installation:

    sudo npm install node-ab -g 

## Usage:

    nab [URL] [--increase 100] [--milliseconds 1] [--help] [--verbose]

## Example:

    nab http://localhost:4000/test
    Request number: 200 Return number: 200 QPS: 66 Traffic: 32KB per second
    Request number: 800 Return number: 800 QPS: 133 Traffic: 65KB per second
    Request number: 1700 Return number: 1700 QPS: 188 Traffic: 92KB per second
    Request number: 2900 Return number: 2900 QPS: 241 Traffic: 117KB per second
    Request number: 4400 Return number: 4400 QPS: 293 Traffic: 143KB per second
    Request number: 6200 Return number: 6200 QPS: 344 Traffic: 168KB per second
    Request number: 8300 Return number: 8300 QPS: 394 Traffic: 192KB per second
    Request number: 10700 Return number: 10700 QPS: 445 Traffic: 217KB per second
    Request number: 13400 Return number: 13400 QPS: 495 Traffic: 242KB per second
    Request number: 16400 Return number: 16366 QPS: 545 Traffic: 266KB per second
    Request number: 16400 Return number: 16366 QPS: 495 Traffic: 241KB per second
    Request number: 16400 Return number: 16366 QPS: 454 Traffic: 221KB per second
    Request number: 16400 Return number: 16366 QPS: 419 Traffic: 204KB per second
    Request number: 16400 Return number: 16366 QPS: 389 Traffic: 190KB per second
    Request number: 18400 Return number: 18268 QPS: 405 Traffic: 198KB per second
    Request number: 21400 Return number: 21009 QPS: 437 Traffic: 213KB per second

## Development

    git clone git@github.com:doubaokun/node-ab.git
    npm install -d

### Start a sample http service at http://127.0.0.1:4000/test
    node sample/app.js

### Start testing the sample http service
    ./bin/nab http://localhost:81/test


