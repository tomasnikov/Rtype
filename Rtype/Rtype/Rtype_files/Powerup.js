var POWERUP_SMALLER_SHIP = 0;
var POWERUP_EXTRA_LIFE = 1;
var POWERUP_SHIELD = 2;
var POWERUP_MULTI_SHOT = 3;

var POWERUP_LENGTH = 4;

function Powerup(descr) {
	for (var property in descr) {
		this[property] = descr[property];
	}

	switch(this.type) {
		case POWERUP_SMALLER_SHIP:
			this.color = 'blue';
			this.letter = 'S';
			break;
		case POWERUP_EXTRA_LIFE:
			this.color = 'grey';
			this.letter = 'P';
			break;
		case POWERUP_SHIELD:
			this.color = 'red';
			this.letter = 'O';
			break;
		case POWERUP_MULTI_SHOT:
			this.color = '#00F4F8';
			this.letter = 'M';
			break;
	}

	console.log(this);
}

Powerup.prototype.remove = false;
Powerup.prototype.halfWidth = 10;
Powerup.prototype.halfHeight = 10;
Powerup.prototype.velX = 0;
Powerup.prototype.velY = 0;
Powerup.prototype.radius = 10;

Powerup.prototype.update = function (du) {

	this.velX = explosionManager.backSpeed;

	if(this.cx <0 || this.remove) {
		return powerupManager.KILL_ME_NOW;
	}

	this.cx -= this.velX*du;
};

Powerup.prototype.reset = function() {
	this.remove = true;
};

Powerup.prototype.render = function (ctx) {
	// (cx, cy) is the centre; must offset it for drawing

	util.fillBox(ctx, this.cx - this.halfWidth,
				 this.cy - this.halfHeight,
				 this.halfWidth * 2,
				 this.halfHeight * 2,
				 this.color, true);
	ctx.font = "bold 15px Arial";
	var oldStyle = ctx.fillStyle;
	ctx.fillStyle = "yellow";
    ctx.fillText(this.letter, this.cx-this.halfWidth+2, this.cy+this.halfHeight-2);
    ctx.fillStyle = oldStyle;
};

Powerup.prototype.giveEffect = function () {
	switch(this.type) {
		case POWERUP_SMALLER_SHIP:
			//this.removeEffects();
			//g_paddle.largerPaddle();
			//Sprite.prototype.smallShip = true;
			break;
		case POWERUP_EXTRA_LIFE:
			//this.HP++;
			break;
		case POWERUP_SHIELD:
			//this.removeEffects();
			//Ship.prototype.hasShield = true;
			break;
		case POWERUP_MULTI_SHOT:
			//this.removeEffects();
			//createExtraShots(2);
			break;
	}
};

Powerup.prototype.removeEffects = function () {
	/*g_paddle.removeEffects();
	for(var i = 0; i < g_balls.length; i++) {
		g_balls[i].removeEffects();
	}*/
};
/*
TODO:
eftir að bæta við Ship.prototype.hasShield = false í ship.js
eftir að laga removeEffects þannig það virki í okkar leik
eftir að bæta þessu við í Enemy.js til að droppa powerups: þetta droppar í 10% skipta.. spurning um að harðkóða powerups inn eða hafa mjög lága prósentu
Enemy.prototype.dropPowerup = function(x, y) {
	if(Math.random() < 0.1) {
		g_powerups.push(new Powerup({
			cx : x,
			cy : y,
			type: Math.floor(Math.random()*POWERUP_LENGTH)
		}));
	}
eftir að bæta við klösum í Ship.js, einn fyrir shield og einn fyrir nýja byssu createExtraShots()
bæta við inní ship.jsvar smallShip = false; 
eftir að setja if skilyrði inní stærð á skipi í sprite.js þar sem if(smallShip) þá er skipið helmingi minna 


eftir að bæta einhverju við í þessum dúr í updatesimulation
for(var i = 0; i < g_powerups.length;) {
        g_powerups[i].update(du);
        if(g_powerups[i].remove) {
            g_powerups.splice(i, 1);
        } else {
            i++;
        }
    }
*/

