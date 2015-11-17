"use strict";

var explosionManager = {

_explosions: [],

backSpeed: 0,


generateShipExplosion: function(descr) {
	descr.radius *= 0.25;
	this._explosions.push(new Explosion(descr));
	descr.cx += 20;
	descr.cy += 5;
	setTimeout(this._explosions.push(new Explosion(descr)), 500);
	descr.cx -= 40;
	descr.cy -= 15
	setTimeout(this._explosions.push(new Explosion(descr)), 900);
	
},

generateEnemyExplosion: function(descr) {
	this._explosions.push(new Explosion(descr));

},

generateBulletExplosion: function(descr) {
	this._explosions.push(new Explosion(descr));
},

KILL_ME_NOW: -1,

update: function(du) {

	var i = 0;

	while (i < this._explosions.length) {

	    var status = this._explosions[i].update(du);

	    if (status === this.KILL_ME_NOW) {
	        // remove the dead guy, and shuffle the others down to
	        // prevent a confusing gap from appearing in the array
	        
	        this._explosions.splice(i,1);
	    }
	    else {
	        ++i;
	    }
	}
},

render: function(ctx) {
	for (var i = 0; i < this._explosions.length; ++i) {
        this._explosions[i].render(ctx);
	}
}


}