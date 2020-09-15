const net =  require("net"); //import node js tcp socket modual



class Server {

	get portNum(){ //I want port num to be read only
		return 320;
	}
	set portNum(n){
		console.log("portNum cannot be changed");
	}


	constructor(){
		 this.clients = []; 
		 this.server = net.createServer({}, (socketToClient)=>{this.onServerStartup(socketToClient)});

	}

	

/*
	makeServer(){
		console.log(`Making Server @ port ${this.portNum} ...`);
		this.server = net.createServer({}, (socketToClient)=>{
			this.onServerStartup(socketToClient)
				

				console.log(socketToClient.localAddress + " has connected!");
				this.clients.push(socketToClient);//add new client to list of clients

				appendServerEvents(socketToClient);
	

				socketToClient.write("Welcome to my server.");


			});
		return this.server;

	}
	*/

	onServerStartup(socketToClient){
		console.log(socketToClient.localAddress + " has connected!");
		this.clients.push(socketToClient);//add new client to list of clients

		this.appendServerEvents(socketToClient);
	

		socketToClient.write("Welcome to my server.");

	}

	appendServerEvents (socketToClient){

		socketToClient.on("error", errMsg=>{//we want to be able to throw errors
			console.log("ERROR: " + errMsg);
		});

		socketToClient.on("close", ()=>{//
			console.log("A client has disconnected...");
			this.clients.splice(this.clients.indexOf(socketToClient), 1); //get index of exiting client and remove it from the clients array
			//console.log(this.clients.Length);

		});

		socketToClient.on("data", txt=>{//recive data from client
			console.log("client says: " + txt);
			this.BroadcastToAll(txt);

		});


	}


	BroadcastToAll(txt, clientToSkip){
		this.clients.forEach(client=>{
			//if(client != clientToSkip) client.write(txt);
			client.write(txt);
		});

	}

}

const server1 = new Server(); 

//server1.makeServer();

server1.server.listen({port:server1.portNum}, ()=>{

	console.log("the server is now listening for incoming connections...");
	

});




/*
listeningSocket.listen({port:portNum}, ()=>{

	console.log("the server is now listening for incoming connections...");
	//listeningSocket.close;

});

*/




