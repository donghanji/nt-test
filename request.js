
process.on('message',function(cmd){
	console.log('request receive message:',cmd);
	//
	var host=cmd.host||'127.0.0.1';
	var port=parseInt(cmd.port,10)||3030;
	var method=(cmd.method||'get').toUpperCase();
	var count=parseInt(cmd.count,10)||1;
	var way=cmd.way||'http';
	var space=parseInt(cmd.space,10)||100;
	var logname=cmd.log||'';

	//var async= require('async');
	var http = require('http');
	var fs = require('fs');
	var iconv = require('iconv-lite');
	var cwd=process.cwd();
	var lname=logname ? '-'+logname : '';
	var filename=[cwd+'/log/req'+lname,'c',count,'s',space,'w',way];
	filename=filename.join('-')+'.log';

	if(logname && /\.log$/.test(logname)){
		//
		if(/^\//.test(logname)){
			filename=logname;
		}else{
			filename=cwd+'/log/'+logname;
		}
		
	}

	var requestStart=[];
	var requestEnd=[];

	function writeFile(callback){
		var str=getContent();
		var arr = iconv.encode(str, 'gbk');
		//
		fs.appendFile(filename, arr, function(err){
			if(err){
				//
				console.log("input file fail " + err);
			}else{
				//
				console.log('input '+filename+' ok');
			}

			callback && callback();
		});
	}

	function getSP(){

		return '=============================';
	}

	function getMS(ns){

		return (ns/(1e6)).toFixed(2);
	}

	function getContent(){
		var str=[Date()];
		var results=[];
		var totals=requestStart.length;
		var totalsT=0;
		for(var i=0;i<totals;i++){
			var t1=requestStart[i];
			var t2=requestEnd[i];
			str.push('count:'+(i+1));
			if(!t2){

				continue;
			}
			//str.push('t1:'+hrtime(t1));
			//str.push('t2:'+hrtime(t2);
			var t=hrtime(t2);
			str.push('   tt:'+t+'ns ; '+getMS(t)+'ms');
			results.push(t);
			totalsT+=t;
			//str.push('');
		}
		str.push('');
		str.push(getSP());

		var min=Math.min.apply(Math,results);
		var max=Math.max.apply(Math,results);

		str.push('min:'+min+'ns ; '+getMS(min)+'ms');
		str.push('max:'+max+'ns ; '+getMS(max)+'ms');
		
		var rtotals=results.length;
		var error=totals-rtotals;
		var percent=((100*rtotals/count).toFixed('2'))+'%';
		var abort=count-totals;

		str.push('error:'+error);
		str.push('abort:'+abort);
		str.push('count:'+count);
		str.push('normal:'+percent);
		var a1=totalsT/rtotals;
		var a2=a1;
		//
		if(rtotals > 2){
			//
			a2=(totalsT-min-max)/(rtotals-2);
		}
		//
		str.push('total: a1:'+a1+'ns ; '+getMS(a1)+'ms');
		str.push('total: a2:'+a2+'ns ; '+getMS(a2)+'ms');

		str.push(getSP());
		str.push('');

		return str.join('\n');
	}

	function hrtime(t){
		
		return t[0] * 1e9 + t[1];
	}

	//
	function request(callback){
		var t1=process.hrtime();
		var opts={
			hostname:host,
			port:port,
			path:'/?t='+Date.now(),
			method:method,
			handers:{}
		};
		console.log('request start time:',t1);
		//
		requestStart.push(t1);

		var req=http.request(opts,function(res){

			//console.log('statusCode:',res.statusCode);
			res.on('data',function(chunk){

		       
		    });
		    //
		    res.on('end',function(){
		    	//console.log('BODY' + chunk);
		       var t2=process.hrtime(t1);
		       console.log('request end time:',t2);

		       requestEnd.push(t2);

		       console.log('request result:',requestEnd.length,count);
				if(count === requestEnd.length){
					//end
					//console.log('request end count:',count);
					//
					writeFile(function(){
						//
						process.exit(-1);
					});
				}

				callback && callback();
		    });
		});
		console.log('request url :',req._headers.host+req.path);
		//
		/*req.on('response',function(){
			console.log('--response--');
		});
		//
		req.on('connect',function(){
			console.log('--connect--');
		});
		//
		req.on('socket',function(){
			console.log('--socket--');
		});
		//
		req.on('upgrade',function(){
			console.log('--upgrade--');
		});
		//
		req.on('continue',function(){
			console.log('--continue--');
		});*/
		//
		//如果在请求过程中出现了错误（可能是DNS解析、TCP的错误、或者HTTP解析错误），返回的请求对象上的'error'的事件将被触发。
		req.on('error',function(e){
		   console.log('error:',e.message);

		   requestEnd.push(0);
		});
		//
		req.end();
	}

	var index=1;
	var t=setInterval(function(){
		if(index > count){

			return clearInterval(t);
		}
		//
		index++;
		//
		request();
	},space);

	//
	process.send({
		result:'receive data success'
	});

	var onExit = function () {
        this.emit('exit');

        console.log('request exited.');
        
        writeFile(function(){
			//
			process.exit(-1);
		});
    }.bind(this);
    //
    process.on('SIGINT', onExit);
    process.on('SIGTERM', onExit);
});