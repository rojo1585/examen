import React, { useState } from 'react'

import Modal from 'react-bootstrap/Modal';

import Button from 'react-bootstrap/Button';

import {AppRouter} from '../../src/index';

import {QueryClient,QueryClientProvider} from 'react-query';

import {trpc} from './trpc'

 

 

function App(){

 

//const [telefono,setTelefono]=useState('');

 

  const [queryClient]=useState(()=>new QueryClient())

  const [trpcClient]=useState(()=>trpc.createClient({

    url:'http://localhost:3000/trpc'

  }))

return (<trpc.Provider client={trpcClient} queryClient={queryClient}>

  <QueryClientProvider client={queryClient}>

    <AppContent/>

  </QueryClientProvider>

</trpc.Provider>)

}

 

 

function AppContent() {

 //Para capturar un registro

  const [nombre,setNombre]=useState('');

  const [direccion,setDireccion]=useState('');

  const [telefono,setTelefono]=useState('');

 

  //Para edición

  const [enombre,setENombre]=useState('');

  const [edireccion,setEDireccion]=useState('');

  const [etelefono,setETelefono]=useState('');

  const [nor,setNor]=useState(0);

 

//Modal

const [show, setShow] = useState(false);

const handleClose = () => setShow(false);

const handleShow = () => setShow(true);

 // const [lista,setLista]=useState([]);

 

  console.log("Listado de personas:")

 //consumir consultas via trpc

  const listaPersonas=trpc.useQuery(['obtenerPersonas']);

  console.log(listaPersonas)

  

  //consumir metodos via trpc

  const agregarPersona=trpc.useMutation(['agregarPersona'])

  const actualizarPersona=trpc.useMutation(['actualizarPersona'])

  const eliminarPersona=trpc.useMutation(['eliminarPersona'])

 

  const client=trpc.useContext()

 

  const Eliminar=(id:number)=>{

   //  alert('A jijos');

  

    eliminarPersona.mutate({id:id},{

      onSuccess(value){

        client.invalidateQueries(['obtenerPersonas'])

      }})

      

    }

 

    const Editar=(i:number,persona:{nombre:string,direccion:string,telefono:string})=>{

    setNor(i);

    setENombre(persona.nombre);

    setEDireccion(persona.direccion);

    setETelefono(persona.telefono);

    handleShow()

    }

 

  const agregar = () =>

  {

  agregarPersona.mutate({nombre:nombre,direccion:direccion,telefono:telefono},{

    onSuccess(value){

      client.invalidateQueries(['obtenerPersonas'])

    }})

  setNombre('')

  setDireccion('')

  setTelefono('')

  console.log(agregarPersona)

  };

 

  const actualizar = () =>

  {

  actualizarPersona.mutate({id:nor,nombre:enombre,direccion:edireccion,telefono:etelefono},{

    onSuccess(value){

      client.invalidateQueries(['obtenerPersonas'])

    }})

  handleClose() 

  setENombre('')

  setEDireccion('')

  setETelefono('')

  console.log(agregarPersona)

  };

 

  if(listaPersonas.isLoading)

  {

    return <h1>Cargado personas..</h1>

  }else

  return (

   

    <div className="container md-5">

    <h1>Directorio telefonico</h1>

 

    <form id="form">

      <div className="mb-3">

        <label htmlFor="CapturadeNombre" className="form-label">Nombre</label>

        <input type="text" className="form-control" value={nombre}

          onChange={(e) => setNombre(e.target.value)}

        placeholder="Teclea aquí el nombre de la persona"/>

      </div>

      <div className="mb-3">

        <label htmlFor="CaoturadelaDireccion" className="form-label">Dirección</label>

          <textarea className="form-control" value={direccion}

          onChange={(e) => setDireccion(e.target.value)}

          

           rows={3}></textarea>

      </div>

      <div className="mb-3">

        <label htmlFor="CaoturadelaTelefono" className="form-label">Telefono</label>

        <input type="tel" className="form-control" value={telefono}

          onChange={(e) => setTelefono(e.target.value)}

         pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" ></input>

      </div> 

    </form>

    <button className="btn btn-warning" onClick={agregar}>Guardar</button>

   

    <div>

      {

      <p>{JSON.stringify(listaPersonas.data)}</p>

 

      }

     

      <div className="row">

        {     

        listaPersonas.data.map((persona: { nombre: string;direccion:string;telefono:string; },index:number)=>(

   

  <div className="col-md-4 p-2">

  <div className="card">

    <div className="card-body">

      <h5 className="card-title">{persona.nombre}</h5>

      <pre className="card-text">{persona.direccion}</pre>

      <p className="card-text">{persona.telefono}</p>

  

      <button className="btn btn-danger me-1" onClick={()=>Eliminar(index)}>Eliminar</button>

      <button className="btn btn-success" onClick={()=>Editar(index,persona)}>Editar</button>

    

    </div>

  </div>

</div>

      

          ))

      

        }

 </div>

    </div>

  

    <Modal show={show} onHide={handleClose}>

        <Modal.Header closeButton>

          <Modal.Title>Editar datos</Modal.Title>

        </Modal.Header>

        <Modal.Body>

        <form id="form">

          <div className="mb-3">

            <label htmlFor="CapturadeNombre" className="form-label">Nombre</label>

            <input type="text" className="form-control" value={enombre}

          onChange={(e) => setENombre(e.target.value)} placeholder="Teclea aquí el nombre de la persona"/>

          </div>

          <div className="mb-3">

            <label htmlFor="CaoturadelaDireccion" className="form-label">Dirección</label>

            <textarea className="form-control" value={edireccion}

          onChange={(e) => setEDireccion(e.target.value)}

             rows={3}></textarea>

          </div>

          <div className="mb-3">

            <label htmlFor="CaoturadelaTelefono" className="form-label">Telefono</label>

            <input type="tel" className="form-control" value={etelefono}

          onChange={(e) => setETelefono(e.target.value)} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" ></input>

          </div>

        </form>

        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={handleClose}>

            Cancelar

          </Button>

          <Button variant="primary" onClick={actualizar}>

            Guardar los cambios

          </Button>

        </Modal.Footer>

      </Modal>   

 

  </div>

 

 

  )

 

}

 