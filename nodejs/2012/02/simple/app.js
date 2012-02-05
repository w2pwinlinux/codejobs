console.log("Mi primer servidor");

var http = require("http");

function onRequest(request, response) {
  response.writeHead(200, {"Content-Type" : "text/html"});
  response.write("Hola @codejobs - @silvercorp");
  response.end();  
}

http.createServer(onRequest).listen(3000);

console.log("Listo!!! peticion lograda");

