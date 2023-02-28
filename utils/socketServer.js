const http = require('http');
const socketio = require('socket.io');



const startSocket = (app)=> {
  const server = http.createServer(app);
  const io = socketio(server);
  io.on('connection', (socket) => {
    // console.log(socket);
    console.log("Socket ------------------")
    console.log('a user connected');
    socket.emit('message', "Welcome to CapaHelp");
  
    socket.broadcast.emit('message', "A user has joined");
  
    // socket.on("chatMessage", (msg) => {
    //   console.log(msg);
      
    // })
    // socket.on('disconnect', () => {
    //   io.emit('message', "A user has left");
      
    // })
  })
  return server;
  
}

module.exports = startSocket;