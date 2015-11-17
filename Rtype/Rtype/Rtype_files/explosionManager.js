"use strict";

var explosionManager = {

_explosions: [],

backSpeed: 0,


generateShipExplosion: function(descr) {
	this._explosions.push(new Explosion(descr));
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