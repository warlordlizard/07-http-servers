'use strict';

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const cowsay = require('cowsay');
const parseBody = require('./lib/parse-body.js');
const PORT = process.env.PORT || 3000;

const server = http.createServer(function(req, res){
  req.url = url.parse(req.url);
  req.url.query = querystring.parse(req.url.query);
  console.log('pathname', req.url.pathname);
  console.log('method', req.method);
  console.log('query', req.url.query);
  if(req.method === 'GET' && req.url.pathname === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/plain'});
    res.write('hello from my server!');
    return res.end();
  }

  if(req.method === 'GET' && req.url.pathname === '/cowsay') {
    let params = req.url.query;
    try {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.write(cowsay.say( {text: params.text, f: params.f}));
      
    } catch (error) {
      res.writeHead(400);
      res.write( cowsay.say( {f: 'DRAGON', text: 'bad request'}));
      
    }
    return res.end();
  }

  if(req.method === 'POST' && req.url.pathname === '/cowsay') {
    parseBody(req, function(err) {
      try {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        console.log('body:',req.body);
        var say = req.body;
        res.write(cowsay.say({ text: say.text}));
        return res.end();
      } catch (err) {
        res.writeHead(400);
        res.write(cowsay.say({ f: 'DRAGON', text: 'bad request' }));
        res.end();
      }
    });
    return;
  }

  res.end();
});

server.listen(PORT, () => {
  console.log(`serving up: ${PORT}`);
});