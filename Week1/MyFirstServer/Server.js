const net = require('net');//require the net module

///const socketServer = net.connect(12345,() => {console.log("loistening for connections...");} );
const socketServer = net.createServer(socketClient=>{ console.log("new Connection!"); 
		
		socketClient.on("error", errMsg =>{
			console.log("error:" + errMsg)
		});
});

socketServer.listen( {port:12345}, ()=> {console.log("Listening for connections...");} );

socketServer.on("error", (errMsg)=>{console.log("didn't work " + errMsg);} );