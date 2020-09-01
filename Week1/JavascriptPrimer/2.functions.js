// in JS, functions are "first-class citizens", ie. functions are objects

var sayHello = function(){console.log("hello");};//you can store functions inside of variables, cuz they are objects!!!

const sayHelloGlobal = function(){console.log("hello");};//this notation is also common

sayHelloGlobal();//you call annonimous functiuons like this

console.log(sayHelloGlobal);//youcan also pass cunctions into other functions

function doFunction(f){
	f();
}

doFunction(sayHelloGlobal);//example

doFunction(function(){console.log("wow");});//we can make functions in one line of code

doFunction(function(){
	console.log("wow2");
});//it can also be notated like so

//ES6 added arrow functions

const square = function(n){return n*n;}; //normal notation

const square1 = (n)=>{return n*n;}; //arrow function notation

const square2 = n =>{return n*n;}; //if you only have one input

const square3 = n => n*n; // if you only have one line of ode

const mult = (a,b) => {return a*b;};

console.log(square3(3));

console.log(mult(3*5));

var people = ["nick","sarah","billy","sam"]

people.forEach( item => {console.log(item);});

