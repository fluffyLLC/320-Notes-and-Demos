//sometimes the `this` keyword is mapped onto other objects
// specifically, when using event-listeners

setTimeout(function(){console.log(this)},100); //<-- `this` is mapped to the event object (not global) here

setTimeout(()=>{console.log(this)},100);//<-- arrow functions do not change the context of `this`

class Server{

	constructor(){
		this.port = 1234

/*
		const sock = require('net').createServer({},function(){
			console.log(this.port); // this is bad because it points to the event not the class
		});
*/

		const sock = require('net').createServer({},()=>{
			console.log(this.port); // this is good because it points to the class
		});


		

	}

}