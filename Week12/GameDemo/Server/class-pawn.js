const NetworkObj = require("./class-networkobject.js").NetworkObject;

exports.Pawn = class Pawn extends NetworkObj{
	constructor(){
		super();
		this.classID = "PAWN";//override after you call super
		this.input = {
			axisH:0,
			axisV:0,

		};

		this.velocity = {x:0,y:0,z:0};

	}

	accelerate(vel, acc, dt){
		//let 

		if(acc){
			//console.log("accelerate true");
			vel += acc * dt;
		} else {
			//no input, slow down
			if(vel > 0){//moveing right...
				acc = -1;//accelerate left
				vel += acc * dt;
				if(vel < 0) vel = 0;
			}

			if(vel < 0){//moving left...
				acc = 1;//accelerate right
				vel += acc * dt;
				if(vel > 0) vel = 0;
			}

		}

		return vel ? vel : 0;//|0;

	}

	update(game){
		//acceleration
		let moveX = this.input.axisH|0;//if this si a number use it | (or) use 0, this should be -1,0,or 1 

		//console.log(moveX);

		//console.log(this.accelerate(this.velocity.x,moveX,game.dt));
		this.velocity.x = this.accelerate(this.velocity.x,moveX,game.dt);
		

		this.position.x += this.velocity.x * game.dt;

		//this.position.x = Math.sin(game.time);
	}



	serialize(){
		const b = super.serialize();

		return b;
	}

}