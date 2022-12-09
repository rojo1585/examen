// get the client mysql
const mysql = require('mysql2');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { Console } = require('console');
const io = new Server(server);

//var lista=[];

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'pdis'
});

function obtenerLista()
{
  connection.query(
    'SELECT * FROM `persona`',
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
       lista=results;
       io.emit('actualizalista',lista);      
    }
  );
}

function agregarPersona(nombre,direccion,telefono){
  console.log("Se agrego una persona..")
  connection.query(
    'INSERT INTO persona(nombre,direccion,telefono) VALUES ("'+nombre+'","'+direccion+'","'+telefono+'")',
    function(err, results, fields) {
    obtenerLista();
    }
  );
}

function actuaizarPersona(nombre,direccion, telefono,id)
{
  console.log("Se actualizo una persona..")
  connection.query(
    'UPDATE persona SET nombre="'+nombre+'",direccion="'+direccion+'",telefono="'+telefono+'" where id='+id,
    function(err, results, fields) {
    obtenerLista();
    }
  );
}


function eliminarPersona(id)
{
  console.log("Se elimino una persona..")
  connection.query(
    'DELETE FROM persona WHERE id='+id,
    function(err, results, fields) {
    obtenerLista();
    }
  );
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/cliente.html');
});

io.on('connection', (socket) => {
  console.log('Un usuario se conecto');
  obtenerLista();
 
  socket.on('agregar', (nombre,direccion,telefono) => {
    console.log('Agregando'+nombre)
    agregarPersona(nombre,direccion,telefono);
     });

  socket.on('actualizar', (nombre,direccion,telefono,id) => {
    actuaizarPersona(nombre,direccion,telefono,id)
    io.emit('actualizalista',lista)
   
  });

  socket.on('eliminar',(no)=>{
    eliminarPersona(no);
  })

 
  socket.on('disconnect', () => {
    console.log('Un usuario se desconecto');
  });
 
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});