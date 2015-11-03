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

    this.setPosition();
    this.randomiseVelocity();
      
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.enemy;
    this.scale  = this.scale  || 1;

/*
    // Diagnostics to check inheritance stuff
    this._EnemyProperty = true;
    console.dir(this);
*/

};

Enemy.prototype = new Entity();

Enemy.prototype.setPosition = function () {
    // Enemy randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || g_canvas.width;
    this.cy = this.cy || Math.random()*g_canvas.height/2;
    this.rotation = this.rotation || 0;
};

Enemy.prototype.randomiseVelocity = function () {
    var MIN_SPEED = 20,
        MAX_SPEED = 70;

    var speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
    var dirn = Math.random() * consts.FULL_CIRCLE;

    console.log(speed);
    console.log(dirn);

    this.velX = this.velX || -speed;
    //this.velY = this.velY || speed;
    this.velY = 0;

    var MIN_ROT_SPEED = 0.5,
        MAX_ROT_SPEED = 2.5;

    this.velRot = this.velRot || 0;
};

Enemy.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if(this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    //console.log(this);

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    this.wrapPosition();
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

};

Enemy.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};

// HACKED-IN AUDIO (no preloading)
Enemy.prototype.splitSound = new Audio(
  "sounds/EnemySplit.ogg");
Enemy.prototype.evaporateSound = new Audio(
  "sounds/EnemyEvaporate.ogg");

Enemy.prototype.takeBulletHit = function () {
    this.kill();
    this.evaporateSound.play();
    
};

Enemy.prototype._spawnFragment = function () {
    entityManager.generateEnemy({
        cx : this.cx,
        cy : this.cy,
        scale : this.scale /2
    });
};

Enemy.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
