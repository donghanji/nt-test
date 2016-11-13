
var cluster = require('cluster');

process.on('message',function(cmd){
	console.log('response receive message:',cmd);
	//
	var size=cmd.size||0;
	var port=parseInt(cmd.port,10)||3030;
	var multi=parseInt(cmd.multi,10)||0;
	var cwd=process.cwd();
	var dataFile=cwd+'/data/'+size+'.data';
	var fs=require("fs");

	if(!fs.existsSync(dataFile)){

		return console.log(dataFile+'is not existed,to use "nt data" create');
	}
	var data=fs.readFileSync(dataFile,"utf-8");

	var http = require('http');
	var server = http.createServer(function (request, response) {
		console.log('http request ...',request.url);
		if(request.url !== '/favicon.ico'){

			console.log('http responsed end.');
			//
			response.writeHead(200, { 'Content-Length': data.length });
		    response.end(data);
		}
	});

	if(multi){
		//
		console.log('multi node listen ...');

		var clusteredNode=require('clustered-node');

		var len=require('os').cpus().length;
		if(multi > len){
			console.log('cpu max length:',len);
			multi=len;
		}
		//console.log('cpu length:',len);
		//
		server.listen(port);
		//
		clusteredNode.listen({
			port:port,
			workers:multi
		},server);

	}else{
		console.log('single node listen ...');
		server.listen(port);
	}
	//
	

	console.log('server runing at : http://localhost:'+port);

	//
	process.send({
		result:'receive data success'
	});
});