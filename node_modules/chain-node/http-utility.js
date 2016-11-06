var request = require('request');
var fs = require('fs');
var path = require('path');
var util = require('util');

var URL = 'https://api.chain.com';
var PEM = fs.readFileSync(path.join(__dirname, './chain.pem'));

module.exports = HttpUtility;

function HttpUtility(c) {
  this.auth = c.auth;
  this.url = c.url || URL;
}

HttpUtility.prototype.makeRequest = function(method, path, body, options, cb) {
  var usingJson = false;
  var r = {
    strictSSL: true,
    cert: PEM,
    auth: this.auth,
    method: method,
    uri: this.url + path
  };
  if(body != null) {
    usingJson = true;
    r['json'] = body;
  }
  if(options != null) {
    r['qs'] = options;
  }
  request(r, function(err, resp, body) {
    if (err) {
      return cb(err);
    }

    if (Math.floor(resp.statusCode / 100) != 2) {
      err = new Error("Chain SDK error: bad status code " + resp.statusCode.toString() + ". See 'resp' property for more detail.");
      err.resp = resp;
      return cb(err);
    }

    if(usingJson) {
      return cb(err, body);
    }

    var parsed;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      err = new Error("Chain SDK error: could not decode JSON response. See 'error' and 'resp' properties for more detail.");
      err.error = e;
      err.resp = resp;
      return cb(err);
    }

    cb(null, parsed);
  });
};

HttpUtility.prototype.post = function(path, body, cb) {
  this.makeRequest('POST', path, body, null, cb);
};

HttpUtility.prototype.delete = function(path, cb) {
  this.makeRequest('DELETE', path, null, null, cb);
};

HttpUtility.prototype.get = function(path, options, cb) {
  if (typeof(options) == 'function') {
    cb = options;
    options = null;
  }

  this.makeRequest('GET', path, null, options, cb);
}
