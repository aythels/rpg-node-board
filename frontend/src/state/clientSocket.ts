const ClientSocket = function (this: any) {
  // TODO Implement ping pong handshake to close socket if server is inactive
  // TODO Implement environment variables and get exact url for socket connection
  // https://stackoverflow.com/questions/1368264/how-to-extract-the-hostname-portion-of-a-url-in-javascript

  console.log('opening client socket');

  const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socketUrl = socketProtocol + '//' + window.location.hostname + ':5000/partyroom'; // whatever path you declared in socketserver.ts
  const socket = new WebSocket(socketUrl); // this uses the native WebSocket class and not a library

  socket.onopen = (event) => {
    console.log('client is connected');
    this.emit('hello from client');
  };

  socket.onclose = () => {
    console.log('client is disconnected');
  };

  socket.onmessage = (event: any) => {
    console.log('message recieved from server:', event.data);
  };

  this.emit = (data: any) => {
    socket.send(data);
  };

  this.closeConnection = () => {
    socket.close();
  };
};

export default ClientSocket;
