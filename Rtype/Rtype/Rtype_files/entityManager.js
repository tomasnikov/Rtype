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


var entityManager = {

// "PRIVATE" DATA

_enemies   : [],
_bullets : [],
_environment : [],
_ships   : [],

_bShowEnemies : true,

currentLevel: 1,

// "PRIVATE" METHODS

_generateEnemies : function(descr) {
    var i;
    var isShipAlive = false;
    if(!descr) descr = {};
    var NUM_ENEMIES = descr.NUM_ENEMIES || 4;
    for(var j = 0; j<this._ships.length; j++) {
        if(this._ships[j].isAlive) {
            isShipAlive = true;
        }
    }
    if(!g_isUpdatePaused && isShipAlive){
        for (i = 0; i < NUM_ENEMIES; ++i) {
            descr.diff = i;
            this.generateEnemy(descr);
        } 
    }
    
},

_generateEnvironment : function() {
    this.generateEnvironment();
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

KILL_ME_NOW : -1,

deferredSetup : function () {
    this._categories = [this._enemies, this._bullets, this._environment, this._ships];
},

init: function() {
    this._generateEnvironment();
},

fireBullet: function(cx, cy, velX, velY, rotation, power, firedFrom) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        power : power,
        rotation : rotation,
        firedFrom : firedFrom
    }));
},

fireBulletAtShip: function(cx, cy, velX, velY, rotation, firedFrom) {
    for(var i = 0; i<this._ships.length; i++) {
        var distX = cx - this._ships[i].cx;
        var distY = cy - this._ships[i].cy;
        var rot = Math.tan(distY/distX);
        rotation = rotation + rot;
        var relVelX = velX;
        var relVelY = -distY/(2*SECS_TO_NOMINALS);
        this._bullets.push(new Bullet({
            cx   : cx,
            cy   : cy,
            velX : relVelX,
            velY : relVelY,
            power : 1,
            rotation : rotation,
            firedFrom : firedFrom
        }));
    }
},

generateBoss: function(descr) {
    this._enemies.push(new Enemy(descr));
},

generateEnemy : function(descr) {
    this._enemies.push(new Enemy(descr));
},

generateEnvironment : function(descr) {
    this._environment.push(new Environment(descr));
},

generateShip : function(descr) {
    this._ships.push(new Ship(descr));
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
    
},

resetEntities: function() {
    this.resetShips();
    this._forEachOf(this._enemies, Enemy.prototype.reset);
    this._forEachOf(this._bullets, Bullet.prototype.reset);
    this._forEachOf(this._environment, Environment.prototype.reset);

    powerupManager.resetPowerups();
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},

haltEntities: function() {
    this.haltShips();
    this._forEachOf(this._enemies, Enemy.prototype.halt);
    this._forEachOf(this._bullets, Bullet.prototype.halt);
    this._forEachOf(this._environment, Environment.prototype.halt);
},

toggleEnemies: function() {
    this._bShowEnemies = !this._bShowEnemies;
},

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {
        //console.log(this._categories[c])
        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                
                aCategory.splice(i,1);
            }
            else if(aCategory[i].points && status === aCategory[i].points) {
                for(var j = 0; j<this._ships.length; j++) {
                    this._ships[j].points += aCategory[i].points;
                }
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }
    //if (this._enemies.length === 0) this._generateEnemies();

},

render: function(ctx) {
    var debugX = 10, debugY = 100;
    var backGround = g_levelManager.getBackground();
    ctx.drawImage(backGround.img, this._environment[0].imageCx + backGround.cxOffset, backGround.cyOffset);

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowEnemies && 
            aCategory == this._enemies)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {
            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

