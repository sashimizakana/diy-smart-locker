var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var Lock = require('./lib/lock.js');
var gpio = require('pi-gpio');

var lock = new Lock(gpio);
lock.attach({
	inA:3
	,inB:5
	,outA:7
	,outB:24
	,motor1:11
	,motor2:13
});

app.use(bodyParser.json());

app.use(express.static('public'));
server.listen(8080);

app.get('/lock',function(req,res){
	res.json({'state':lock.state});
});

app.post('/lock',function(req,res){
    switch(req.body.state){
        case 'lock':
            lock.lock();
            break;
        case 'open':
            lock.open();
            break
    }
	res.json({'state':lock.state});
});

var distance = null;

