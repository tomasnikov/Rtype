function MainMenu() {
	//sprite: g_sprites.logo,
	this.rtypetext = {
		sprite: g_sprites.logo,
		text: "R-Type",
		color:"white",
		cx: g_canvas.width/2,
		cy: 150,
		height: 30,
		width: 100
	}
	this.playtext = {
		text: "Play",
		color:"white",
		cx: g_canvas.width/2,
		cy: 250,
		height: 20,
		width: 100
	}
	this.controlstext = {
		text: "Controls",
		color:"white",
		cx: g_canvas.width/2,
		cy: 300,
		height: 20,
		width: 100
	}
	this.showLevelSelector = false
	this.showControls = false

	this.levelSelector = []
	var gap = 20;
	this.levelSelector[0] = {
		text: "Select Level:",
		color: "white",
		cx: g_canvas.width/2,
		cy: 375,
		width: 100,
		height: 20
	}
	for(var i = 1; i < g_levelManager.nrLevels+1; i++){
		var levelObject = {
			text: (i).toString(),
			color: "white",
			cx: g_canvas.width/2 - (g_levelManager.nrLevels*gap/2) + (i*gap),
			cy: 400,
			width: gap-g_ctx.measureText((i+1).toString()).width - 5,
			height: 20
		}
		this.levelSelector[i] = levelObject;
	}
}
	//levelSelector: this.initLevelSelector(),
MainMenu.prototype.click = function(xPos, yPos){
	var playtext = this.playtext;
	var rtypetext = this.rtypetext;
	var controlstext = this.controlstext;	
	if(g_mouseX < playtext.cx+playtext.width 
		&& g_mouseX > playtext.cx-playtext.width
		&& g_mouseY < playtext.cy+playtext.height
		&& g_mouseY > playtext.cy-playtext.height){
			this.showControls = false;
			this.showLevelSelector = true;
		//main.toggleMenu()
	}
	if(g_mouseX < controlstext.cx+controlstext.width 
		&& g_mouseX > controlstext.cx-controlstext.width
		&& g_mouseY < controlstext.cy+controlstext.height
		&& g_mouseY > controlstext.cy-controlstext.height){
		this.showLevelSelector = false;
		this.showControls = true;
	}
	if(this.showLevelSelector){
		for(var i = 1; i < this.levelSelector.length; i++){
			var levelSelector = this.levelSelector[i];
			if(xPos < levelSelector.cx + levelSelector.width 
				&& xPos> levelSelector.cx - levelSelector.width
				&& yPos < levelSelector.cy + levelSelector.height
				&& yPos > levelSelector.cy - levelSelector.height){
				this.playGame(i-1);
			}
		}
	}
}
MainMenu.prototype.playGame = function(level){
	g_levelManager.level = level;
	entityManager.init()
	main.toggleMenu();
}
MainMenu.prototype.updateLevelSelector = function(){
	for(var i = 1; i < this.levelSelector.length; i++){
		this.levelSelector[i].color = "white";
		var levelSelector = this.levelSelector[i];
		if(g_mouseX < levelSelector.cx + levelSelector.width
			&& g_mouseX > levelSelector.cx - levelSelector.width
			&& g_mouseY < levelSelector.cy + levelSelector.height
			&& g_mouseY > levelSelector.cy - levelSelector.height){
			this.levelSelector[i].color = "blue";
		}
	}
}
MainMenu.prototype.renderlevelSelector = function(ctx){
	ctx.save()
	ctx.textAlign = "center";
	for(var i = 0; i < this.levelSelector.length; i++){
		var levelSelector = this.levelSelector[i];
		ctx.fillStyle = levelSelector.color
		ctx.fillText(levelSelector.text , levelSelector.cx, levelSelector.cy)
	}
	ctx.restore();
}
MainMenu.prototype.renderControls = function(ctx){
	ctx.save();
	ctx.fillStyle = "white";
	ctx.font = "20px Arial"
	ctx.textAlign = "center";
	ctx.fillText("Spacebar: shoot", g_canvas.width/2,380);
	ctx.fillText("Up: W", g_canvas.width/2,400);
	ctx.fillText("Down: S", g_canvas.width/2,420);
	ctx.fillText("Left: A", g_canvas.width/2,440);
	ctx.fillText("Right: D", g_canvas.width/2,460);
	ctx.restore();
}
MainMenu.prototype.update = function(du){
	var playtext = this.playtext;
	var rtypetext = this.rtypetext;
	var controlstext = this.controlstext;
	rtypetext.color = "white"
	playtext.color = "white"
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
	if(this.showLevelSelector){
		this.updateLevelSelector()
	}
}
MainMenu.prototype.render = function(ctx){
	ctx.save();
	var middleX = g_canvas.width/2;
	var playtext = this.playtext;
	var rtypetext = this.rtypetext;
	var controlstext = this.controlstext;
	util.clearCanvas(ctx)
	ctx.textAlign = "center";
	//ctx.font = rtypetext.height + "px Arial";
	//ctx.fillStyle = this.rtypetext.color;
	//ctx.fillText(rtypetext.text ,rtypetext.cx ,rtypetext.cy);
	rtypetext.sprite.drawCentredAt(
    	ctx, rtypetext.cx, rtypetext.cy, 0
   	);
	ctx.font = playtext.height + "px Arial"
	ctx.fillStyle = playtext.color;
	ctx.fillText(playtext.text, playtext.cx,playtext.cy);
	ctx.fillStyle = controlstext.color;
	ctx.fillText(controlstext.text,controlstext.cx, controlstext.cy);
	if(this.showLevelSelector){
		this.renderlevelSelector(ctx);
	}
	if(this.showControls){
		this.renderControls(ctx);
	}
	ctx.restore();
}

/*var mainMenu = {
	//sprite: g_sprites.logo,
	rtypetext: {
		//sprite: g_sprites.logo,
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
	showLevelSelector: false,
	showControls: false,
	initLevelSelector: function(){
		var levelSelector = [];
		var gap = 20;
		for(var i = 0; i < levelManager.nrLevels; i++){
			var levelObject = {
				text: (i+1).toString(),
				color: "white",
				cx: g_canvas.width/2 - (levelManager.nrLevels*gap/2) + (i*gap),
				cy: 400,
				width: gap-g_ctx.measureText((i+1).toString()).width - 5,
				height: 20
			}
			levelSelector[i] = levelObject;

		}
		//console.log(levelSelector)
		return levelSelector;
	},	
	//levelSelector: this.initLevelSelector(),
	click: function(xPos, yPos){
		var playtext = this.playtext;
		var rtypetext = this.rtypetext;
		var controlstext = this.controlstext;	
		if(g_mouseX < playtext.cx+playtext.width 
			&& g_mouseX > playtext.cx-playtext.width
			&& g_mouseY < playtext.cy+playtext.height
			&& g_mouseY > playtext.cy-playtext.height){
				this.levelSelector = this.initLevelSelector()
				this.showControls = false;
				this.showLevelSelector = true;
			//main.toggleMenu()
		}
		if(g_mouseX < controlstext.cx+controlstext.width 
			&& g_mouseX > controlstext.cx-controlstext.width
			&& g_mouseY < controlstext.cy+controlstext.height
			&& g_mouseY > controlstext.cy-controlstext.height){
			this.showLevelSelector = false;
			this.showControls = true;
		}
		if(this.showLevelSelector){
			for(var i = 0; i < this.levelSelector.length; i++){
				var levelSelector = this.levelSelector[i];
				if(xPos < levelSelector.cx + levelSelector.width 
					&& xPos> levelSelector.cx - levelSelector.width
					&& yPos < levelSelector.cy + levelSelector.height
					&& yPos > levelSelector.cy - levelSelector.height){
					this.playGame(i);
				}
			}
		}
	},
	playGame: function(level){
		levelManager.level = level;
		entityManager.init()
		main.toggleMenu();
	},
	updateLevelSelector: function(){
		for(var i = 0; i < this.levelSelector.length; i++){
			this.levelSelector[i].color = "white";
			var levelSelector = this.levelSelector[i];
			if(g_mouseX < levelSelector.cx + levelSelector.width
				&& g_mouseX > levelSelector.cx - levelSelector.width
				&& g_mouseY < levelSelector.cy + levelSelector.height
				&& g_mouseY > levelSelector.cy - levelSelector.height){
				this.levelSelector[i].color = "blue";
			}
		}
	},
	renderlevelSelector: function(ctx){
		ctx.save()
		ctx.textAlign = "center";
		for(var i = 0; i < this.levelSelector.length; i++){
			var levelSelector = this.levelSelector[i];
			ctx.fillStyle = levelSelector.color
			ctx.fillText(levelSelector.text , levelSelector.cx, levelSelector.cy)
		}
		ctx.restore();
	},
	renderControls: function(ctx){
		ctx.save();
		ctx.fillStyle = "white";
		ctx.font = "20px Arial"
		ctx.textAlign = "center";
		ctx.fillText("Spacebar: shoot", g_canvas.width/2,380);
		ctx.fillText("Up: W", g_canvas.width/2,400);
		ctx.fillText("Down: S", g_canvas.width/2,420);
		ctx.fillText("Left: A", g_canvas.width/2,440);
		ctx.fillText("Right: D", g_canvas.width/2,460);
		ctx.restore();
	},
	update: function(du){
		var playtext = this.playtext;
		var rtypetext = this.rtypetext;
		var controlstext = this.controlstext;
		rtypetext.color = "white"
		playtext.color = "white"
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
		if(this.showLevelSelector){
			this.updateLevelSelector()
		}
	},
	render: function(ctx){
		ctx.save();
		var middleX = g_canvas.width/2;
		var playtext = this.playtext;
		var rtypetext = this.rtypetext;
		var controlstext = this.controlstext;
		util.clearCanvas(ctx)
		ctx.textAlign = "center";
		ctx.font = rtypetext.height + "px Arial";
		ctx.fillStyle = this.rtypetext.color;
		ctx.fillText(rtypetext.text ,rtypetext.cx ,rtypetext.cy);
		//this.sprite.drawCentredAt(
        //	ctx, rtypetext.cx, rtypetext.cy, 0
    	//);
		ctx.font = playtext.height + "px Arial"
		ctx.fillStyle = playtext.color;
		ctx.fillText(playtext.text, playtext.cx,playtext.cy);
		ctx.fillStyle = controlstext.color;
		ctx.fillText(controlstext.text,controlstext.cx, controlstext.cy);
		if(this.showLevelSelector){
			this.renderlevelSelector(ctx);
		}
		if(this.showControls){
			this.renderControls(ctx);
		}
		ctx.restore();
	}
}*/