exports.Game = class Game {
	constructor(server){
		
		this.frame = 0;
		this.timeTillStateUpdate = 0;
		this.time = 0;
		this.dt = 16/1000;


		this.ballPos = {
			x: 0,
			y: 0,
			z: 0

		}


		this.server = server;


		this.update();
	}

	update(){
		//console.log(this.time);
		this.time += this.dt;
		this.frame++;

		const player = this.server.getPlayer(0);

		if(player){
			this.ballPos.x += player.input.axisH * 1 * this.dt;
		}

		//this.ballPos.x = Math.sin(this.time) * 2;
		/*if(this.server.clients.length > 0){

			const c = this.server.clients[0];
			this.ballPos.x += c.input.h * 1 * this.dt; //ball moves at 1m/s

		}*/

		if(this.timeTillStateUpdate > 0){
			this.timeTillStateUpdate -= this.dt;

		} else {
			this.timeTillStateUpdate = .1;
			this.sendBallPos();
		}

		//TODO: tell server to send packets to all clients
		

		setTimeout(()=>this.update(),16);
	}

	sendBallPos(){
		const packet = Buffer.alloc(20);
		packet.write("BALL",0);
		packet.writeUInt32BE(this.frame,4);
		packet.writeFloatBE(this.ballPos.x,8);
		packet.writeFloatBE(this.ballPos.y,12);
		packet.writeFloatBE(this.ballPos.z,16);

		this.server.sendPacketToAll(packet);
	}


}