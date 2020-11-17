const NetworkObj = require("./class-networkobject.js").NetworkObject;

exports.Pawn = class Pawn extends NetworkObject{
	constructor(){
		super();
		this.classID = "PAWN";//override after you call super

	}

}