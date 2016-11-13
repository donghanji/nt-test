#!/usr/bin/env node

var program = require('commander');

var packageJson = require('./package.json');

function get_params(cmd){
	var res={};
	var params=cmd._events||{};
	for(var k in params){
		res[k]=cmd[k];
	}
	//console.log('get params:',res);
	//
	return res;
}

program
	.version(packageJson.version)
	/*.option('-m, --mp <multi>', 'Multi-process,1|0,default "0"')
	.option('-c, --rc <count>', 'Request-count,default "1"')
	//.option('-v, --nv <version>', 'Node-version')
	.option('-s, --rs <size>', 'Response-size,default "helloword"')
	.option('-w, --rw <way>', 'Request-way,default "http"');*/

program.command('init')
	.description('nt-test init ')
	.action(function(cmd){	
		var cp=require('child_process');
		var fs=require('fs');
		var spawn=cp.spawn;
		var cwd=process.cwd();
		var datas=__dirname+'/data';
		var logs=cwd+'/log';
		cp.exec('cp -rf '+datas+' '+cwd,function(err, stdout, stderr){
			if(err){
				//
				console.log('init response data files error:',err);
			}else{
				//
				console.log('init reponse data files ok');
			}
		});

		if(fs.existsSync(logs)){
			//
			console.log('init log directory ok');
			//
			return console.log(logs+' is already existed');
		}

		cp.exec('mkdir log',function(err, stdout, stderr){
			if(err){
				//
				console.log('init log directory error:',err);
			}else{
				//
				console.log('init log directory ok');
			}
		});
	});

//request
program.command('req')
	.description('request ')
	.option('-h, --host <host>', 'Server host,default "127.0.0.1"')
	.option('-p, --port <port>', 'Server port,default 3030')
	.option('-m, --method <method>', 'Request-method,default "get"')
	.option('-c, --count <count>', 'Request-count,default "1"')
	.option('-w, --way <way>', 'Request-way,default "http"')
	.option('-s, --space <space>', 'Request-space,default "100ms"')
	.action(function(cmd){	
		var cp=require('child_process');
		var spawn=cp.spawn;
		var fileName=__dirname+'/request.js';
		var child=cp.fork(fileName);

		var r=spawn('node',[fileName]);

		child.on('message',function(m){
			//
			console.log('request message:',m.result);
		});

		var cmds=get_params(cmd);

		child.send(cmds);
	});

//response
program.command('res')
	.description('response data size')
	.option('-p, --port <port>', 'Server port,default 3030')
	.option('-m, --multi <multi>', 'Multi-process,1|0,default "0"')
	.option('-s, --size <size>', 'Response-size,default "helloword"')
	.action(function(cmd){
		var cp=require('child_process');
		var spawn=cp.spawn;
		var fileName=__dirname+'/response.js';
		var child=cp.fork(fileName);

		var r=spawn('node',[fileName]);


		child.on('message',function(m){
			//
			console.log('response message:',m.result);
		});

		var cmds=get_params(cmd);

		child.send(cmds);
	});
//clear
program.command('clear')
	.description('clear log file')
	.action(function(){
		var cp=require('child_process');
		var spawn=cp.spawn;
		var cwd=process.cwd();

		var logs=cwd+'/log/*';
		//
		cp.exec('rm -rf '+logs,function(err, stdout, stderr){
			if(err){
				//
				console.log('clear log files error:',err);
			}else{
				//
				console.log('clear all log files');
			}
		});
	});
//data
program.command('data')
	.description('create response test data')
	.option('-s, --size <size>', 'Create response data size,size * 1k')
	.action(function(cmd){
		var size=parseInt(cmd.size,10)||0;
		if(!size){

			return console.log('should input a size number');
		}
		var cp=require('child_process');
		var fs=require('fs');
		var spawn=cp.spawn;
		var cwd=process.cwd();

		var dataFile=cwd+'/data/'+size+'.data';

		if(fs.existsSync(dataFile)){

			return console.log(dataFile+' is already existed');
		}

		var baseFile=cwd+'/data/1.data';

		var data=fs.readFileSync(baseFile,"utf-8");
		var str=[];
		//
		for(var i=0;i<size;i++){
			str.push(data);
		}
		//
		fs.appendFile(dataFile, str.join(''), function(err){
			if(err){
				//
				console.log("input file fail " + err);
			}else{
				//
				console.log('input '+dataFile+' ok');
			}
		});
	});


program.parse(process.argv);

var onExit = function () {

    console.log('command exited.');
    
    process.exit(-1);
};
//
process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);