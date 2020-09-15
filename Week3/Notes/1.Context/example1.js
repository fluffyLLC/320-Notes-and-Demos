// how does the `this` keword work

// in oop, 	`this` refers to the object containing the code, Javascript is Similar

const cat = "meow"; //global variable

function doTHing() {
	console.log(cat); //this will print thing
}

function example1(){
	console.log(this);
}

example1(); // <-- this will print nothing

new example1(); // <-- this will print something

class Example2{
	constructor(){
		console.log(this);
	}
}

new Example2(); // <-- this will also print something