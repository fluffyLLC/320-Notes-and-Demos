const NetworkObj = require("./class-networkobject.js").NetworkObject;

exports.Pawn = class Pawn extends NetworkObj{
	constructor(){
		super();
		this.classID = "PAWN";//override after you call super

	}

	update(game){

		this.position.x = Math.sin(game.time);
	}


	serialize(){
		const b = super.serialize();

		return b;
	}

}