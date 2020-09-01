//there are three ways to declare variables in JS:

var bigwomen = "bigwomen";
let age = 82;
const doILikePizza = true;

// can't change const
// doILikePizza = false; //<--- this will crash


//javascript is untyped. Variables don't have types
//and can switch what datatype they store

bigwomen = 69.0;

// declaring functions

function doSomething(n/*n has no specific type*/){

	if(1=1){// the value we return isn't set. 
		return true;// It can be a bool
	}else{
		return "bannana";// or a srting, from the same function
	}

}

//arrays

var myArray = [];//empty array
var students = ["me", "logan","Andrew"];//litteral array
students.push("Gizmo");

var stuff = [1, "cow", false, null];


//objects
//objects can be litteral as well
// literal objects use JSON

var myObj = {};

myObj = {
	age:17,
	faveColor: "purple",
	isDead: false,
	favoriteBooks["dune","LOTR"],
};

stuff = [true,42,{x:13,y:22},null]; //you can put objects in arrays




