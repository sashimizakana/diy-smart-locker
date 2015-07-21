var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var Lock = require('lib/lock.js');
var gpio = require('gpio');

var lock = new Lock(gpio);
lock.attach({
	inA:5
	,inB:6
	,outA:13
	,outB:19
	,motor1:20
	,motor2:21
});

app.use(bodyParser.json());

app.use(express.static('public'));
server.listen(80);

app.get('/lock',function(req,res){
	res.json({'state':lock.state});
});

app.post('/lock',function(req,res){
	lock.change(req.state);
	res.json({'state':lock.state});
});

var distance = null;

