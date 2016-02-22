# postmessage.io

## example of server code
```javascript
  var server = new postmessage.Server(window);

  server.on('connection', function (client) {
    console.log('a client connected');

    client.send('message', 'hi from server!');

    client.on('ping', function () {
      console.log('got ping');
      client.send('pong');
    });

    client.on('disconnect', function () {
      console.log('a client disconnected');
    });
  });

  server.listen();
```

## example of client code
```javascript
  var client = new postmessage.Client(window, '*');
  var serverWindow = document.createElement('iframe');

  client.on('connected', function () {
    console.log('connected to server');

    setInterval(function () {
      console.log('sending ping');
      client.send('ping');
    }, 1000);
  });

  client.on('pong', function () {
    console.log('received pong');
  });

  client.on('message', function (msg) {
    console.log('received message: ', msg);
  });

  window.addEventListener('load', function () {
    document.body.appendChild(serverWindow);
    serverWindow.setAttribute('src', 'http://localhost:8081');
    serverWindow.addEventListener('load', function () {
      client.connect(serverWindow.contentWindow);
    });
  });
```
