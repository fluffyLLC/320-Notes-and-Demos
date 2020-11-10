const Server = require("./server.js").Server;
const PacketBuilder = require("./packetBuilder.js").PacketBuilder


const Game = {

	whoseTurn:1,
	whoHasWon:0,
	board:[[0,0,0],
		   [0,0,0],
		   [0,0,0]
	],
	clientX:null, //player 1
	clientO:null, //player 2
	playMove(client,x,y){
		if(this.whoHasWon > 0) return;//idnore move packets after game has ended
		//if(client != this.clientX && client != this.clientX) return; //ignore spectator move packets

		if(this.whoseTurn == 1 && client != this.clientX) return;
		if(this.whoseTurn == 2 && client != this.clientO) return;

		if(x < 0 || y < 0) return;//ignore moves off the board

		if(y >= this.board.length) return;//ignore moves off the board
		if(x >= this.board[y].length) return;//ignore moves off the board

		if(this.board[y][x] > 0) return; //ignore moves on taken spaces

		this.board[y][x] = this.whoseTurn; //sets board state

		this.whoseTurn = (this.whoseTurn == 1) ? 2 : 1;//toggles turn to next player
		this.checkStateAndUpdate();


	},
	checkStateAndUpdate(){

		//ToDO: look for game over

		const packet = PacketBuilder.update(this);
		Server.broadcastToAll(packet);
		//TODO: send UPDT packet to ALL
	}
}

Server.start(Game);
//console.log(Server);