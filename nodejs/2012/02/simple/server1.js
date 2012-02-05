var http = require("http");
var url = require("url");
var qs = require("querystring");

function start(handle) {
	http.createServer(function (request, response) {	
		if (request.method == "GET") {
			var url_parts = url.parse(request.url,true);
        	console.log(url_parts.query);
		}
		
		if (request.method == "POST") {
			var postData = "";
			var pathname = url.parse(request.url).pathname;
			request.setEncoding("utf8");

    		request.addListener("data", function(postDataChunk) {
      			postData += postDataChunk;
      			console.log("Recibiendo los siguientes datos '"+
      			postDataChunk + "'.");
    		});    		
		}
		
	    response.writeHead(200, {"Content-Type": "text/html"});
    	response.write("Hola a todos desde @codejobs\n\n");
	    response.end();
	
		console.log("Server ON");
	
	}).listen(8080, "127.0.0.1");
}

exports.start = start;


