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
    this.multiplier = 1;
    this._isWarping = false;
    this.HP = this.fullLife;
    this.spriteSelection = 2

    this.shield = true;

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
Ship.prototype.powerupTime = 0;
    
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

    if(this.isColliding() && this.isAlive && !this.shield) {
        if(this.HP > 0) {
        this.HP--;
        //entityManager.resetEntities();
        this.bufferAfterDeath();
        }
        else {
            this.HP--;
            this.power = 0;
            main.gameOver();
        }
    }
    else {
        spatialManager.register(this);
    }

    if(powerupManager) {
        var collidesWithPowerup = powerupManager.collidesWithPowerup(this.cx, this.cy, this.getRadius());
        if(collidesWithPowerup) {
            this.setPowerup(collidesWithPowerup.type);
        } 
    }

    if(this.powerupTime) {
        this.powerupTime -= du;
    }

    if(this.powerupTime<0) {
        this.resetPowerups();
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

Ship.prototype.setPowerup = function(type) {
    var POWERUP_SMALLER_SHIP = 0;
    var POWERUP_EXTRA_LIFE = 1;
    var POWERUP_SHIELD = 2;
    var POWERUP_MULTI_SHOT = 3;

    switch(type) {
        case POWERUP_SMALLER_SHIP:
            if(!this.smallShip) {
                this._scale *= 0.5;
                for(var i = 0; i < g_sprites.ship.length; i++) {
                    g_sprites.ship[i].width *= 0.5;
                    g_sprites.ship[i].height *= 0.5;
                }
                this.smallShip = true; 
            }
            
            break;
        case POWERUP_EXTRA_LIFE:
            this.HP++;
            break;
        case POWERUP_SHIELD:
            this.shield = true;
            break;
        case POWERUP_MULTI_SHOT:
            this.multipleShots = true;
            break;
    }

    this.powerupTime = 3*SECS_TO_NOMINALS;
};

Ship.prototype.resetPowerups = function() {
    this.shield = false;
    this.multipleShots = false;

    if(this.smallShip) {
        this._scale *= 2;
        for(var i = 0; i < g_sprites.ship.length; i++) {
            g_sprites.ship[i].width *= 2;
            g_sprites.ship[i].height *= 2;
        } 
    }
    this.smallShip = false;   

    this.powerupTime = 0;
};

Ship.prototype.computeSubStep = function (du) {
    
    var thrust = this.computePosition();

    this.cx = thrust.x;
    this.cy = thrust.y;
        
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

Ship.prototype.maybeFireBullet = function () {
    if (keys[this.KEY_FIRE]) {
        this.power = this.power<10 ?  this.power + 0.1 : 10;
        document.getElementById("power").value = this.power;
    }
    else if(this.power>0) {
        this.power = Math.ceil(this.power);
            
        this.fireBullet(this.rotation, 0);

        if(this.multipleShots) {
            this.fireBullet(this.rotation + Math.PI/4, 20);
            this.fireBullet(this.rotation - Math.PI/4, 20);
        }

        this.power = 0;
        document.getElementById("power").value = this.power;

        this.lastBullet = 0.3*SECS_TO_NOMINALS;
    }
    
};

Ship.prototype.fireBullet = function(rotation, extraDist) {
    var dX = +Math.sin(rotation);
    var dY = -Math.cos(rotation);
    var launchDist = this.getRadius()  + 4 * this.power + extraDist;
    
    var relVel = this.launchVel;
    var relVelX = dX * relVel;
    var relVelY = dY * relVel;

    entityManager.fireBullet(
       this.cx + dX * launchDist, this.cy + dY * launchDist,
       this.velX + relVelX, this.velY + relVelY,
       rotation, this.power, "Ship");
};

Ship.prototype.getRadius = function () {
    return (this.sprite[2].width / 2)*this._scale * 0.9;
};

Ship.prototype.takeBulletHit = function () {
    if(!this.shield) {
        if(this.HP > 0) {
            this.HP--;
            this.bufferAfterDeath();
        }
        else {
            this.HP--;
            this.power = 0;
            main.gameOver();
        }  
    }
};

Ship.prototype.explode = function(time) {
    explosionManager.generateShipExplosion({
        cx: this.cx,
        cy: this.cy,
        radius: this.getRadius(),
        lifeTime: time,
        sprite: g_sprites.explosion1
    });
}

Ship.prototype.bufferAfterDeath = function() {
    this.explode(0.4);
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
    document.getElementById("power").value = this.power;
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Ship.prototype.render = function (ctx) {

    if(this.shield) {
        ctx.save();
        ctx.strokeStyle = "white";
        util.strokeCircle(ctx, this.cx, this.cy, this.getRadius()*1.1);
        ctx.restore();
    }

    var width = g_sprites.ship[0].width;
    var height = g_sprites.ship[0].height;

    this.sprite[Math.floor(this.spriteSelection)].drawCentredAt(
        ctx, this.cx - width/2, this.cy - height/2, 0
    );

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
