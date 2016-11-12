'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

server.register({
  register: require('h2o2')
}, function (err) {

  if (err) {
    console.log('Failed to load h2o2', err);
    return
  }
  server.route({
    method: '*',
    path: '/{path*}',
    handler: {
      proxy: {
        mapUri: function (request, callback) {
          var headers = {
            'user-agent': 'machikoyasuda',
            'Accept': 'application/vnd.github.v3+json'
          }
          if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = 'token ' + process.env.GITHUB_TOKEN
          }
          callback(null, 'https://api.github.com/' + (request.params.path || ''), headers)
        },
        passThrough: true
      }
    }
  });
  server.start(function (err) {
    console.log('Server started at: ' + server.info.uri);
  });
});
