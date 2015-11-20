function MainMenu() {
	//sprite: g_sprites.logo,
	this.rtypetext = {
		sprite: g_sprites.logo,
		text: "R-Type",
		color:"white",
		cx: -300,//g_canvas.width/2,
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
	this.dislplaySelection = false
	this.message = ""
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
			cy: 420,
			width: gap-g_ctx.measureText((i+1).toString()).width - 5,
			height: 20
		}
		this.levelSelector[i] = levelObject;
	}
	this.gamesPlayed = 0;
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
	if(this.gamesPlayed == 0){
		createInitialShips();
		entityManager.init()
	}
	else{
		entityManager.resetEntities()
		//entityManager.restart()
		//createInitialShips();
	}
	this.gamesPlayed++
	g_isUpdatePaused = false;
	
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
		if(i > 0){
			ctx.strokeStyle = levelSelector.color
			ctx.strokeRect(levelSelector.cx - levelSelector.width/2-4 , levelSelector.cy - levelSelector.height, levelSelector.width+8, levelSelector.height +8)
		}
	}
	ctx.restore();
}
MainMenu.prototype.renderControls = function(ctx){
	ctx.save();
	ctx.fillStyle = "white";
	ctx.font = "20px Lucida Console"
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
	//move logo:
	if(this.rtypetext.cx <= g_canvas.width/2){
		this.rtypetext.cx += 10;
		if(this.rtypetext.cx >= g_canvas.width/2){
			this.dislplaySelection = true
		}
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
	rtypetext.sprite.drawCentredAt(
    	ctx, rtypetext.cx, rtypetext.cy, 0
   	);
   	if(this.dislplaySelection){
		ctx.font = playtext.height + "px Lucida Console"
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
		ctx.fillStyle = "white"
		ctx.fillText(this.message, g_canvas.width /2,530);

	}
	ctx.restore();
}