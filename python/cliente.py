from xmlrpc.client import ServerProxy

 

s=ServerProxy("http://localhost:20064",allow_none=True)

 

s.set('lenguaje','Python')

s.set('version','3.7.3')

print(s.keys())

print(s.get('version'))

print(s.get('lenguaje'))

print(s.exists('math'))

print(s.exists('framework'))

print(s.exists('version'))