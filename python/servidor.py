from xmlrpc.server import SimpleXMLRPCServer

 

class RPC:

    _metodos_rpc=['get', 'set','delete','exists','keys']

    def  __init__(self,direccion):

        self._datos={}

        self._servidor = SimpleXMLRPCServer(direccion,allow_none=True)

        for metodo in self._metodos_rpc:

            self._servidor.register_function(getattr(self,metodo))

   

    def get(self,nombre):

        return self._datos[nombre]

 

    def set(self,nombre,valor):

        self._datos[nombre]=valor

 

    def delete(self,nombre):

        del self._datos[nombre]

 

    def exists(self,nombre):

        return nombre in self._datos

 

    def keys(self):

        return list(self._datos)

 

    def iniciar_servidor(self):

        self._servidor.serve_forever()

 

if __name__ == '__main__':

    rpc=RPC(('',20064))

    print('Se ha iniciado el servidor RPC!!')

    rpc.iniciar_servidor()

 