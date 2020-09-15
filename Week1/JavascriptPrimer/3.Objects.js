const obj = {
 x:13
};

//obj = 42 <--- this will crash, cont means we can't change the TYPE of object we are pointing to

obj.x = 57; //<---- HGowever, this is valid

obj.y = 69 //<--- this is also valid as objects can be changed dynamically

obj.update = fnction(){console.log("wow, I am updating");};//this also applies for functions

//old js doesn't have classes, functions used to be a stand in

function person(){

	this.name = "jimmy";
	this.sayHello = ()=>{

		console.log("Hello, I'm " + this.name)
	}
}

var jim = new person();

jim.sayHello();

//However, classes have been added recently though in ES6

class Sprite{

	constructor(){ //variables should be declared in the constructor can
		this.x = 0;
		this.y = 154;
		this.rotation = 45
	}

	die(){
		this.isDead = true; //<---Variables can still be added dynamically
	}
}


class Enemy extends Sprite{ //Inheritence does exist
	constructor(){
		super();//must call the super's constructor to access properties

	}

	spin(amount){
		this.rotation += amount;
	}

}

var e = new Enemy();

console.log(e.rotation);
e.spin(5);
console.log(e.rotation);