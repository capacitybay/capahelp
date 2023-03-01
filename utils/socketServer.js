// const http = require('http');
// const socketio = require('socket.io');
// const app = require("express")();




// const startSocket = (app)=> {
//   const server = http.createServer(app);
//   const io = socketio(server);
//   // console.log(servers)
//   // console.log(io)
//   const startIo = ()=>{
//     io.on('connection', (socket) => {
//       console.log("Socket ------------")
//         console.log("User connected");
//     })
//   }
//   return server;
  
// }

// const startSocketio = ()=> {
//   const servers = startSocket(app)
//   const io = socketio(servers);
//   // console.log(servers)
//   // console.log(io)
//   io.on('connection', (socket) => {
//     console.log("Socket ------------")
//       console.log("User connected");
//   })
//   // return io;
// }

// module.exports = {
//   startSocket,
//   // startSocketio
// };

// io.on('connection', (socket) => {
//   // console.log(socket);
//   console.log("Socket ------------------")
//   console.log('a user connected');
//   socket.emit('message', "Welcome to CapaHelp");

//   socket.broadcast.emit('message', "A user has joined");

//   // socket.on("chatMessage", (msg) => {
//   //   console.log(msg);
    
//   // })
//   // socket.on('disconnect', () => {
//   //   io.emit('message', "A user has left");
    
//   // })
// })