const net = require("net");//import node js tcp socket modual 


class User {
	get portNum(){ //I want port num to be read only
		return 320;
	}
	set portNum(n){
		console.log("portNum cannot be changed");
	}

	get userIP(){ //I want IP to be read only
		return "127.0.0.1"; //I don't feel like looking up my IP, also this is accurate atm
	}
	set userIP(n){
		console.log("portNum cannot be changed");
	}

	get targetIP(){ //I want IP to be read only
		return "127.0.0.1"; 
	}
	set targetIP(n){
		console.log("portNum cannot be changed");
	}

	constructor(){
		this.color = {r:255,g:255,b:255}
		this.userIndex;
		this.userName = "CoolFella";
		this.userID = "SAJABH";
		this.socketToServer = net.connect({port:this.portNum, ip:this.targetIP}, this.onConnectedToServer());
		this.appendEventListeners();

	}

	onConnectedToServer(){
		console.log("we are now connected to the server")
		//this.socketToServer.

		
	}

	appendEventListeners(){
		this.socketToServer.on("error", errMsg=>{
			console.log("ERROR: " + errMsg);

		});

		//how we recive info from our pcp socket:
		this.socketToServer.on("data", txt=>{

			console.log("server says: " + txt);

		});

	}


}

var user = new User();
user.socketToServer.write("Hello! I am a client...");



/*
const socketToServer = net.connect({port:320, ip:"127.0.0.1"},()=>{
	console.log("we are now connected to the server")
	socketToServer.write("Hello! I am a client...");
});
*/
