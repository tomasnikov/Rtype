// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
    this.HP = this.fullLife;
    this.spriteSelection = 2
};

Ship.prototype = new Entity();

Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Ship.prototype.KEY_THRUST = 'W'.charCodeAt(0);
Ship.prototype.KEY_RETRO  = 'S'.charCodeAt(0);
Ship.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Ship.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Ship.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = Math.PI/2;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 5;
Ship.prototype.numSubSteps = 1;
Ship.prototype.power = 0;
Ship.prototype.fullLife = 3;
Ship.prototype.points = 0;
Ship.prototype.isAlive = true;
Ship.prototype.lastBullet = 0;

// HACKED-IN AUDIO (no preloading)
Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
    
Ship.prototype.update = function (du) {
    
    spatialManager.unregister(this);
    if(this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    if(this.isAlive) {
        for (var i = 0; i < steps; ++i) {
            this.computeSubStep(dStep);
        }
        if(this.lastBullet<=0) {
          this.maybeFireBullet();
        }
        
    }
    if(this.lastBullet>0) {
        this.lastBullet -= du;
    }

    if(this.isColliding() && this.isAlive) {
        if(this.HP > 0) {
        this.HP--;
        //entityManager.resetEntities();
        this.bufferAfterDeath();
        }
        else {
            this.HP--;
            main.gameOver();
        }
    }
    else {
        spatialManager.register(this);
    }
    if(!keys[this.KEY_THRUST] && !keys[this.KEY_RETRO] && this.spriteSelection != 2){
        if(this.spriteSelection < 2){
            this.spriteSelection += 0.1
        }
        else{
            this.spriteSelection -= 0.1
        }
    }
};

Ship.prototype.computeSubStep = function (du) {
    
    var thrust = this.computePosition();

    // Apply thrust directionally, based on our rotation
    //var accelX = +Math.sin(this.rotation) * thrust;
    //var accelY = -Math.cos(this.rotation) * thrust;
    
    //accelY += this.computeGravity();

    //this.applyAccel(accelX, accelY, du);

    this.cx = thrust.x;
    this.cy = thrust.y;
    
    //this.wrapPosition();
    
    if (thrust === 0 || g_allowMixedActions) {
        this.updateRotation(du);
    }
};

var NOMINAL_GRAVITY = 0.12;

Ship.prototype.computeGravity = function () {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
};

var NOMINAL_THRUST = 3;
var NOMINAL_RETRO  = -0.1;

Ship.prototype.computePosition = function () {
    
    var x = this.cx;
    var y = this.cy;
    var r = this.getRadius();
    
    if (keys[this.KEY_THRUST] && y > r) {
        y -= NOMINAL_THRUST;
        if(this.spriteSelection+1 < this.sprite.length){
            this.spriteSelection+= 0.1;
        }
    }
    if (keys[this.KEY_RETRO] && y < g_canvas.height - r) {
        y += NOMINAL_THRUST;
        if(this.spriteSelection-1 >= 0){
            this.spriteSelection-= 0.1;
        }
    }
    if (keys[this.KEY_LEFT] && x > r) {
        x -= NOMINAL_THRUST;
    }
    if (keys[this.KEY_RIGHT] && x < g_canvas.width - r) {
        x += NOMINAL_THRUST;
    }
    
    var thrust = {
        x: x,
        y: y
    }
    return thrust;
};

Ship.prototype.applyAccel = function (accelX, accelY, du) {
    
    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;
    
    // v = u + at
    this.velX += accelX * du;
    this.velY += accelY * du; 

    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;
    
    // Decide whether to use the average or not (average is best!)
    var intervalVelX = g_useAveVel ? aveVelX : this.velX;
    var intervalVelY = g_useAveVel ? aveVelY : this.velY;
    
    // s = s + v_ave * t
    var nextX = this.cx + intervalVelX * du;
    var nextY = this.cy + intervalVelY * du;
    
    // bounce
    if (g_useGravity) {

	var minY = g_sprites.ship.height / 2;
	var maxY = g_canvas.height - minY;

	// Ignore the bounce if the ship is already in
	// the "border zone" (to avoid trapping them there)
	if (this.cy > maxY || this.cy < minY) {
	    // do nothing
	} else if (nextY > maxY || nextY < minY) {
            this.velY = oldVelY * -0.9;
            intervalVelY = this.velY;
        }
    }
    
    // s = s + v_ave * t
    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

Ship.prototype.maybeFireBullet = function () {
    if (keys[this.KEY_FIRE]) {
        this.power = this.power<10 ?  this.power + 0.1 : 10;
        document.getElementById("power").value = this.power;
    }
    else if(this.power>0) {
        this.power = Math.ceil(this.power);
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius()  + 4 * this.power;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation, this.power, "Ship");
        this.power = 0;
        document.getElementById("power").value = this.power;

        this.lastBullet = 0.3*SECS_TO_NOMINALS;
    }
    
};

Ship.prototype.getRadius = function () {
    return (this.sprite[2].width / 2)*this._scale * 0.9;
};

Ship.prototype.takeBulletHit = function () {
    if(this.HP > 0) {
        this.HP--;
        this.bufferAfterDeath();
        //entityManager.resetEntities();
    }
    else {
        this.HP--;
        main.gameOver();
    }
};

Ship.prototype.explode = function(time) {
    explosionManager.generateShipExplosion({
        cx: this.cx,
        cy: this.cy,
        radius: this.getRadius(),
        lifeTime: time
    });
}

Ship.prototype.bufferAfterDeath = function() {
    this.explode(2);
    this.isAlive = false;
    var ship = this;
    var time = 2*1000;
    entityManager.haltEntities();
    setTimeout(function(){
        entityManager.resetEntities();
    }, time)
};

Ship.prototype.reset = function () {
    
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this.halt();
    this.isAlive = true;
    this.power = 0;
    if(this.HP < 0){
        this.HP = 3
        this.points = 0
    }
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.1;

Ship.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT]) {
        //this.rotation -= NOMINAL_ROTATE_RATE * du;
    }
    if (keys[this.KEY_RIGHT]) {
        //this.rotation += NOMINAL_ROTATE_RATE * du;
    }
};

Ship.prototype.render = function (ctx) {
    //var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    //this.sprite.scale = this._scale;
    //this.sprite.drawCentredAt(
	//ctx, this.cx, this.cy, this.rotation
    //);
    //this.sprite.scale = origScale;
    //------------------
    var width = g_sprites.ship[0].width;
    var height = g_sprites.ship[0].height;
    //console.log(this.sprite[2])
    //console.log(this.spriteSelection)
    this.sprite[Math.floor(this.spriteSelection)].drawCentredAt(
        ctx, this.cx - width/2, this.cy - height/2, 0
    );
    //------------------
    for(var i = 0; i<this.HP; i++) {
        this.sprite[2].drawCentredAt(
            ctx, (i+1)*(this.getRadius()*2), this.getRadius(), 0
        );
    }
    
    ctx.save();
    ctx.font = "30px Arial black";
    ctx.fillStyle = "black";
    ctx.fillText("Points: " + this.points, 120, g_canvas.height - 30);
    ctx.restore();
    
};
