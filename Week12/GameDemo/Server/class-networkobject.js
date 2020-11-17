


exports.NetworkObject = class NetworkObject{

	static _idCount = 0;

	constructor(){
		this.classID = "NWOB";
		this.networkID = ++NetworkObject._idCount;

	}


}

