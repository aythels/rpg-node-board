import WebSocket, { WebSocketServer } from 'ws';

// https://www.npmjs.com/package/ws
const SocketServer = function (this: any, httpServer: any, route: any) {
  console.log('starting socket server');

  const port = process.env.PORT || 5000;

  const server = new WebSocketServer({ server: httpServer, path: route });

  server.on('connection', (ws: any) => {
    ws.isAlive = true;

    this.emit(ws, 'hello from server');

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (data: any, isBinary: boolean) => {
      const message = isBinary ? data : data.toString();
      console.log('user sent information', message);
    });

    ws.on('close', () => {
      console.log('user left');
    });
  });

  // send data to everyone
  this.broadcastAll = (data: any) => {
    server.clients.forEach((client: any) => {
      client.send(data);
    });
  };

  // send data to everyone except for the specified client
  this.broadcastExcept = (ws: any, data: any) => {
    server.clients.forEach((client: any) => {
      if (client != ws) client.send(data);
    });
  };

  // send data to specified client
  this.emit = (ws: any, data: any) => {
    ws.send(data);
  };

  // close the server
  this.close = () => {
    server.close();
  };

  // disconnect inactive clients after 30 seconds
  function pingSockets() {
    server.clients.forEach((client: any) => {
      if (!client.isAlive) client.terminate();
      else {
        client.isAlive = false;
        client.ping();
      }
    });
  }

  const timer = setInterval(() => pingSockets(), 30000);

  server.on('close', () => clearInterval(timer));
};

export default SocketServer;
