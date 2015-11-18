/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var powerupManager = {

// "PRIVATE" DATA

_powerups   : [],

// "PRIVATE" METHODS

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

KILL_ME_NOW : -1,

collidesWithPowerup: function(posX, posY, radius) {
    for(var i = 0; i < this._powerups.length; i++) {
        var p = this._powerups[i];
        var distBetweenEntities = util.wrappedDistSq(p.cx, p.cy, posX, posY);
        var minDist = util.square(p.radius + radius);
        if(distBetweenEntities < minDist && distBetweenEntities!==0) {
            p.remove = true;
            return p;
        }
    }
},

generatePowerup: function(descr) {
    this._powerups.push(new Powerup(descr));
},

resetPowerups: function() {
    this._forEachOf(this._powerups, Powerup.prototype.reset);
    
},

update: function(du) {

    var i = 0;

    while (i < this._powerups.length) {

        var status = this._powerups[i].update(du);

        if (status === this.KILL_ME_NOW) {
            // remove the dead guy, and shuffle the others down to
            // prevent a confusing gap from appearing in the array
            
            this._powerups.splice(i,1);
        }
        else {
            ++i;
        }
    }
},

render: function(ctx) {
    for (var i = 0; i < this._powerups.length; ++i) {
        this._powerups[i].render(ctx);
    }
}

}

