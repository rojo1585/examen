const mysql = require('mysql2');
const express = require("express");
const bodyParser = require("body-parser");
const { JSONRPCServer } = require("json-rpc-2.0");
const cors = require('cors');

let lista=[];


const server = new JSONRPCServer();

// First parameter is a method name.
// Second parameter is a method itself.
// A method takes JSON-RPC params and returns a result.
// It can also return a promise of the result.

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'pdis'
});

function obtenerLista() {
  return connection.promise().query("select * from persona")
  .then((data)=>{
    return data[0];
  })
}

function agregarPersona(nombre,direccion,telefono){
  console.log("Se agrego una persona..")
  connection.query(
    'INSERT INTO persona(nombre,direccion,telefono) VALUES ("'+nombre+'","'+direccion+'","'+telefono+'")',
    function(err, results, fields) {
    }
  );
}

function actualizarPersona(nombre,direccion, telefono,id)
{
  console.log("Se actualizo una persona..")
  connection.query(
    'UPDATE persona SET nombre="'+nombre+'",direccion="'+direccion+'",telefono="'+telefono+'" where id='+id,
    function(err, results, fields) {
  //  obtenerLista();
    }
  );
}


function eliminarPersona(id)
{
  console.log("Se elimino una persona..")
  connection.query(
    'DELETE FROM persona WHERE id='+id,
    function(err, results, fields) {
//    obtenerLista();
    }
  );
}


server.addMethod("obtenerLista",async () => {
  const result = await obtenerLista();
  return result;
})

server.addMethod("agregarPersona",({nombre,direccion,telefono})=>{
  agregarPersona(nombre,direccion,telefono);
  return {status:'ok'}
})

server.addMethod("actualizarPersona",({nombre,direccion,telefono,id})=>{
  actualizarPersona(nombre,direccion,telefono,id);
  return {status:'ok'}
})

server.addMethod("eliminarPersona",({id})=>{
  eliminarPersona(id);
  return {status:'ok'}
})

server.addMethod("echo", ({ text }) => text);
server.addMethod("sumar", ({ valor1,valor2 }) => valor1+valor2);
server.addMethod("log", ({ message }) => console.log(message));

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

app.post("/json-rpc", (req, res) => {
  const jsonRPCRequest = req.body;
  // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
  // It can also receive an array of requests, in which case it may return an array of responses.
  // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
  server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      // If response is absent, it was a JSON-RPC notification method.
      // Respond with no content status (204).
      res.sendStatus(204);
    }
  });
});
console.log('Servidor JSON-RPC corriendo en el puerto 8080..');
app.listen(8080)