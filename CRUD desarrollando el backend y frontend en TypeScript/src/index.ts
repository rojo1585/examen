import express from 'express';

import * as trpc from '@trpc/server';

import * as trpcExpress from '@trpc/server/adapters/express';

import cors from "cors";

import { z } from 'zod';

import { string } from 'zod/lib';

 

let listaPersonas:any= [];

const appRouter = trpc.router()

.query('hello',{

resolve(){

  return 'Hola mundo cruel'; 

}

})

.query('obtenerPersonas',{

    resolve(){

    return listaPersonas;

    }

})

.mutation('agregarPersona',{

    input:z.object({

        nombre:z.string(),

        direccion:z.string(),

        telefono:z.string()

    }),

    resolve({input}){

        listaPersonas.push({

            nombre:input.nombre,

            direccion:input.direccion,

            telefono:input.telefono

        })

        console.log(listaPersonas);

        return 'Registro agregado!!';

    }

})

.mutation('actualizarPersona',{

    input:z.object({

        id:z.number(),

        nombre:z.string(),

        direccion:z.string(),

        telefono:z.string()

    }),

    resolve({input}){

        listaPersonas[input.id].nombre=input.nombre;

        listaPersonas[input.id].direccion=input.direccion;

        listaPersonas[input.id].telefono=input.telefono;

        console.log(listaPersonas);

        return 'registro actualizado!!';

    }

})

.mutation('eliminarPersona',{

    input:z.object({

        id:z.number()

    }),

    resolve({input}){

        const eliminado=listaPersonas.splice(input.id,1)

        console.log(eliminado);

        return 'registro eliminado!!';

    }

})

 

// only export *type signature* of router!

// to avoid accidentally importing your API

// into client-side code

 

export type AppRouter = typeof appRouter;

const app=express()

app.use(cors())

app.use('/trpc',trpcExpress.createExpressMiddleware({

    router:appRouter,

    createContext:()=>null,

}))

 

app.listen(3000)

console.log("Escuchando en el puerto 3000")