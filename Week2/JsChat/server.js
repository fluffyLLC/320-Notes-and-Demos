const net =  require("net"); //import node js tcp socket modual

const portNum = 321;

const clients = []; // an array of all connected clients

const listeningSocket = net.createServer({}, (socketToClient)=>{
	console.log(socketToClient.localAddress + " has connected!");
	clients.push(socketToClient);//add new client to list of clients

	socketToClient.on("error", errMsg=>{//we want to be able to throw errors
		console.log("ERROR: " + errMsg);
	});

	socketToClient.on("close", ()=>{//
		console.log("A client has disconnected...");
		clients.splice(clients.indexOf(socketToClient), 1); //get index of exiting client and remove it from the clients array
		console.log(clients.Length);

	});

	socketToClient.on("data", txt=>{//recive data from client
		console.log("client says: " + txt);
		BroadcastToAll(txt);

	});

	socketToClient.write("Welcome to my server.")


});



function BroadcastToAll(txt, clientToSkip){
	clients.forEach(client=>{
		//if(client != clientToSkip) client.write(txt);
		client.write(txt);
	});

}


listeningSocket.listen({port:portNum}, ()=>{//port:12345 is a pretty malware heavy port

	console.log("the server is now listening for incoming connections...");
	//listeningSocket.close;

});