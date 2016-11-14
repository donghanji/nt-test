# nt-test
node request/response test

### #First,
`
npm install nt-test -g
`


### #Second
`
  nt -h
`
<br/>
to see command help

### #Third,
`
nt init
`
<br/>
to init,create data and log file in current directory


### #Fourth,
`
nt data -s 10
`
<br/>
to create response data,size * 1k,<br/>
if < 1,like 0.2,will size * 100 * 10b,<br/>
will create a 10.data file in ./data directory.

### #Fifth,
`
nt res -s 10
`
<br/>
to create a response,you will to see help,like this
<br/>
`
nt res -h
`
<br/>
more,
<pre>
  nt res
  -p:port,default 3030
  -m:multi,multi process,default false,input cpus number
  -s:size:response data size,which is in ./data:
    0:”hello word"
    100:100k
    200:200k
    500:500k
    1000:1000k
    10000:10000k
</pre>

### #Sixth,
`
nt req -m 2 -s 1000
`
<br/>
to create a request ,by multi process,space is 1000ms.to see help,like this
<br/>
`
nt req -h
`
<br/>
more,
<pre>
nt req
  -h:host，server host, default 127.0.0.1
  -p:port，server port, default 3030
  -c:count，request count ,defualt 1
  -w:way，request way, default http,now only
  -m:method，request method, default get
  -s:space，request space time, default 100ms
</pre>

### #Seventh
`
nt clear
`
<br/>
to clear log files ,in ./log/*
