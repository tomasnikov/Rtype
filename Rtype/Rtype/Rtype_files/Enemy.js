// ====
// Enemy
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Enemy(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
      
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.enemy;
    this.scale  = this.scale  || this.sprite.scale;
    this.diff = 2*this.getRadius()*1.3*this.diff;

    this.setPosition();
    this.randomiseVelocity();
    this.randomiseRange();
    this.setHP();
    this.points = 50;
};

Enemy.prototype = new Entity();

Enemy.prototype.launchVel = 3;

Enemy.prototype.setHP = function() {
    this.fullLife = Math.ceil(Math.random()*3);
    this.HP = this.fullLife;
}

Enemy.prototype.setPosition = function () {
    // Enemy randomisation defaults (if nothing otherwise specified)
    var radius = this.getRadius();
    this.cx = this.cx || g_canvas.width-radius + this.diff;
    var minBottom = radius + 50;
    var maxTop = g_canvas.height - radius - 50;
    this.cy = this.cy || g_canvas.height/2 || util.randRangeFromSeed(minBottom, maxTop, this.randomSeed);;
    this.rotation = this.rotation || 0;
    this.degree = this.degree || 0;
    this.origCx = this.cx;
    this.origCy = this.cy;
};

Enemy.prototype.randomiseVelocity = function () {
    var MIN_SPEED = 50,
        MAX_SPEED = 100;

    var speed = util.randRangeFromSeed(MIN_SPEED, MAX_SPEED, this.randomSeed) / SECS_TO_NOMINALS;
    var dirn = Math.random() * consts.FULL_CIRCLE;

    this.velX = this.velX || -150/SECS_TO_NOMINALS;
    //this.velY = this.velY || speed;
    this.velY = this.velX*0.5;
    this.origVelY = this.velY;

    var MIN_ROT_SPEED = 0.5,
        MAX_ROT_SPEED = 2.5;

    this.velRot = this.velRot || 0;
};

Enemy.prototype.randomiseRange = function() {
    var botMax = g_canvas.height - this.getRadius() - this.cy;
    var topMax = -this.getRadius() + this.cy;
    this.range = 1 || Math.abs(this.randomSeed*Math.min(botMax, topMax));
}

Enemy.prototype.update = function (du) {
    //this.degree += Math.PI/24;
    //this.velY = Math.cos(this.degree)*10;
    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);

    var collided = this.isColliding();
    if(collided && collided.firedFrom != "Enemy") {
        this.kill();
    }

    if(this._isDeadNow) {
        if(this._givePoints==this.points) {
            return this.points;
        }
        return entityManager.KILL_ME_NOW;
    }

    if(this.cx > g_canvas.width) {
        this.velY = 0;
    }
    else if(this.velY === 0) {
        this.velY = this.origVelY;
    }
    else {
        //console.log(spatialManager.computeNextEnemyMove(this.cx, this.cy, this.getRadius(), this.velX, this.velY));
        this.velY = spatialManager.computeNextEnemyMove(this.cx, this.cy, this.getRadius(), this.origVelY, this.velY);
    }
    //console.log(this.velY);

    this.cx += this.velX * du;

    if(this.cx < g_canvas.width && this.cx > 0) {
       this.maybeFireBullet(); 
    }
    

    /*
    if(Math.abs(this.cy - this.origCy) > this.range) {
        this.velY = -this.velY;
        this.origCy = this.cy;
    }
    */

    this.cy += this.velY * du;
    if(this.cx<-this.getRadius()) {
        this.kill();
    }

    this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    //this.wrapPosition();
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

};

Enemy.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.7;
};

Enemy.prototype.maybeFireBullet = function() {
    var shouldFireBullet = Math.random();
    if(shouldFireBullet<0.002) {
        var launchDist = this.getRadius();
        entityManager.fireBulletAtShip(
           this.cx + launchDist, this.cy,
           this.velX - this.launchVel, this.velY,
           -Math.PI/2, "Enemy");
    }
};

Enemy.prototype.takeBulletHit = function (power, firedFrom) {
    if(firedFrom === "Ship") {
        console.log("got here");
        var origHP = this.hp;
        this.HP = this.HP - power > 0 ? this.HP - power : 0;
        if(this.HP <= 0) {
            this.kill(this.points);
        }
        return power-origHP;  
    }
      
};

Enemy.prototype.reset = function() {
    this.kill();
}

Enemy.prototype._spawnFragment = function () {
    entityManager.generateEnemy({
        cx : this.cx,
        cy : this.cy,
        scale : this.scale /2
    });
};

Enemy.prototype.render = function (ctx) {
    
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
