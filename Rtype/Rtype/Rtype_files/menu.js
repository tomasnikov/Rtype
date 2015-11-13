var mainMenu = {
	rtypetext: {
		text: "R-Type",
		color:"white",
		cx: g_canvas.width/2,
		cy: 200,
		height: 30,
		width: 100
	},
	playtext: {
		text: "Play",
		color:"white",
		cx: g_canvas.width/2,
		cy: 250,
		height: 20,
		width: 100
	},
	controlstext: {
		text: "Controls",
		color:"white",
		cx: g_canvas.width/2,
		cy: 300,
		height: 20,
		width: 100
	},
	click: function(xPos, yPos){
		console.log("click")
		var playtext = this.playtext;
		var rtypetext = this.rtypetext;
		var controlstext = this.controlstext;	
		if(g_mouseX < playtext.cx+playtext.width 
			&& g_mouseX > playtext.cx-playtext.width
			&& g_mouseY < playtext.cy+playtext.height
			&& g_mouseY > playtext.cy-playtext.height){
			main.toggleMenu()
		}
		/*if(g_mouseX < controlstext.cx+controlstext.width 
			&& g_mouseX > controlstext.cx-controlstext.width
			&& g_mouseY < controlstext.cy+controlstext.height
			&& g_mouseY > controlstext.cy-controlstext.height){
		}*/

	},
	update: function(du){
		var playtext = this.playtext;
		var rtypetext = this.rtypetext;
		var controlstext = this.controlstext;
		rtypetext.color = "white",
		playtext.color = "white",
		controlstext.color = "white"
		if(g_mouseX < playtext.cx+playtext.width 
			&& g_mouseX > playtext.cx-playtext.width
			&& g_mouseY < playtext.cy+playtext.height
			&& g_mouseY > playtext.cy-playtext.height){
			this.playtext.color = "blue";
		}
		if(g_mouseX < controlstext.cx+controlstext.width 
			&& g_mouseX > controlstext.cx-controlstext.width
			&& g_mouseY < controlstext.cy+controlstext.height
			&& g_mouseY > controlstext.cy-controlstext.height){
			this.controlstext.color = "blue";
		}
	},
	render: function(ctx){
		var middleX = g_canvas.width/2;
		var playtext = this.playtext;
		var rtypetext = this.rtypetext;
		var controlstext = this.controlstext;
		util.clearCanvas(ctx)
		ctx.textAlign = "center";
		ctx.font = rtypetext.height + "px Arial";
		ctx.fillStyle = this.rtypetext.color;
		ctx.fillText(rtypetext.text ,rtypetext.cx ,rtypetext.cy);
		ctx.font = playtext.height + "px Arial"
		ctx.fillStyle = playtext.color;
		ctx.fillText(playtext.text, playtext.cx,playtext.cy);
		ctx.fillStyle = controlstext.color;
		ctx.fillText(controlstext.text,controlstext.cx, controlstext.cy);
	}
}