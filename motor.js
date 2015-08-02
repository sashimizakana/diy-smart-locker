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
},function(){
    setTimeout(function(){
        lock.turnLeft();
    },1000);
});
