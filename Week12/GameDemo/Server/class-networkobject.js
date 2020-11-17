


exports.NetworkObject = class NetworkObject{

	static _idCount = 0;

	constructor(){
		this.networkID = ++NetworkObject._idCount;

	}


}

