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

_generateEnemies : function(NUM_ENEMIES , sprite) {
    var i;
    var randomSeed = Math.random();
    var isShipAlive = false;
    for(var j = 0; j<this._ships.length; j++) {
        if(this._ships[j].isAlive) {
            isShipAlive = true;
        }
    }
    if(!g_isUpdatePaused && isShipAlive){
        for (i = 0; i < NUM_ENEMIES; ++i) {
            this.generateEnemy({
                randomSeed: randomSeed,
                diff: i,
                sprite: sprite
            });
        } 
    }
    
},

_generateEnvironment : function() {
    this.generateEnvironment();
},

_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._enemies, this._bullets, this._environment, this._ships];
},

init: function() {
    this._generateEnemies();
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
    //console.log(cx, cy, velX, velY, rotation);
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
    console.log(descr);
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

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
    
},

resetEntities: function() {
    this.resetShips();
    this._forEachOf(this._enemies, Enemy.prototype.reset);
    this._forEachOf(this._bullets, Bullet.prototype.reset);
    this._forEachOf(this._environment, Environment.prototype.reset);

    powerupManager.resetEntities();
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
    ctx.drawImage(g_images['space'], this._environment[0].imageCx, -300);

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

