const net = require("net");


///represents protocall
const Packet = {
	charEndOfPacket:"\n",
	charDelimiter:"\t",

	buildChat:function(usernameFrom, message){
		return this.buildFromParts(["CHAT", usernameFrom, message]);

	},
	buildAnnouncment:function(message){
		return this.buildFromParts(["ANNC",message]);
	},
	buildNameOkay:function(){
		return this.buildFromParts(["NOKY"]);
	},
	buildNameBad:function(error){
		return this.buildFromParts(["NBAD",error]);
	},
	buildDM:function(usernameFrom, message){
		return this.buildFromParts(["DMSG",usernameFrom ,message]);
	},
	buildList:function(arrOfClients){
		const arrayOfUsernames = [];

		arrOfClients.forEach(c=>{
			if(c.userName) arrayOfUsernames.push(c.userName);
			else arrayOfUsernames.push(c.socket.localAddress);

		});
		arrayOfUsernames.unshift("LIST");

		return this.buildFromParts(arrayOfUsernames);
	},
	buildFromParts:function(arr){
		return arr.join(this.charDelimiter)+this.charEndOfPacket;
	},
};



//console.log(Packet.buildFromParts(["CHAT","Nick","fun"]));

class Client {

	constructor(socket,server){
		this.server = server;
		this.buffer = "";
		this.userName = "";
		this.socket = socket;
		this.socket.on("error",(e)=>this.onError(e));
		this.socket.on("close",()=>this.onDisconnect());
		this.socket.on("data",(d)=>this.onData(d));

	}

	onError(errMsg){
		console.log("Error: with " + this.socket.localAddress + errMsg)

	}

	onDisconnect(){
		server.onClientDisconnect(this);
	}

	onData(data){

		this.buffer += data;

		//split buffer apart into "packets":
		const packets = this.buffer.split("\n");

		//remove last item from array and set buffer to it
		this.buffer = packets.pop();
		
		packets.forEach(p=>this.handlePacket(p));

		//console.log(packets.length + " new packets recieved from " + this.socket.localAddress)

	}


	handlePacket(packet){
		const parts = packet.split("\t");

		switch(parts[0]){
			case "CHAT": 

				this.server.broadcast(Packet.buildChat(this.userName,parts[1]));

				break;

			case "DMSG":
				//console.log("DM recieved from " + parts[1]);

				this.server.clients.forEach(c=>{
					if(c.userName == parts[1] || c.socket.localAddress == parts[1]){
						c.sendPacket(Packet.buildDM(this.userName,parts[2]));
						//break; // <--------- will this actually break out of the foreach function?
					}
				});

				break;

			case "NAME": 

				const newName = parts[1];
				var nameUnique = true;

				this.server.clients.forEach(c=>{
					if(newName == c.userName){
						nameUnique = false;
					}
				});
				
				if(nameUnique){
					this.userName = newName;
					this.sendPacket(Packet.buildNameOkay());
					this.sendPacket(Packet.buildList(this.server.clients));
				}else{

					this.sendPacket(Packet.buildNameBad("Name already in use"));
				}

				break;

			case "LIST":
				console.log("List Requested");
				this.sendPacket(Packet.buildList(this.server.clients));

				break;


		}

	}

	sendPacket(packet){
		this.socket.write(packet);
		
	}

}


class Server {
	constructor(){
		this.port = 320;

		this.clients = [];

		this.socket = net.createServer({}, c=> this.onClientConnect(c));
		this.socket.on("error", e=>this.onError(e));
		this.socket.listen({port:this.port}, ()=>this.onStartListen());
	}

	onStartListen(){
		console.log("the server is now listening on port "+this.port);

	}

	onClientConnect(socketToClient){
		var message = "A new client has connected from " + socketToClient.localAddress;


		this.clients.push(new Client(socketToClient,this));

		console.log(message);
		this.broadcast(Packet.buildAnnouncment("A new client has connected!"));

		//TODO: broadcast List to everyone
		this.broadcast(Packet.buildList(this.clients));

	}

	onClientDisconnect(client){

		var message;
		if(client.userName) message = client.userName + " has disconnected";
		else message = client.socket.localAddress + " has disconnected";
		
		this.clients.splice(this.clients.indexOf(client),1);
		console.log(message);

		this.broadcast(Packet.buildAnnouncment(message));
		this.broadcast(Packet.buildList(this.clients));

	}

	onError(errMsg){
		console.log("Error: " + errMsg);

	}

	broadcast(packet){
		//sends packet to all connected clients
		this.clients.forEach(c=>{c.sendPacket(packet);});
	}

}

const server = new Server();