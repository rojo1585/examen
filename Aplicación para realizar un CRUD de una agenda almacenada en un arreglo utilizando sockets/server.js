const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var lista=[]
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/cliente.html');
});

io.on('connection', (socket) => {
   
  socket.on('agregar', (nombre,direccion,telefono) => {
    console.log('Agregando'+nombre)
    lista.push({nombre:nombre,direccion:direccion,telefono:telefono})
    console.log(lista)
    io.emit('actualizalista',lista)
 
  });

  socket.on('actualizar', (nombre,direccion,telefono,no) => {
    console.log('Actualizando:'+nombre)
    lista[no].nombre=nombre;
    lista[no].direccion=direccion;
    lista[no].telefono=telefono;
    console.log(lista)
    io.emit('actualizalista',lista)
   
  });

  socket.on('eliminar',(no)=>{
    const removed = lista.splice(no,1)
    io.emit('actualizalista',lista)
  })

  console.log('a user connected');
  io.emit('actualizalista',lista);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
 
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});