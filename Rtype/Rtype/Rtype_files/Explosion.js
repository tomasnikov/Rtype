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
function Explosion(descr) {

    // Common inherited setup logic from Entity
    for (var property in descr) {
        this[property] = descr[property];
    }

    this.origRadius = this.radius;
    this.lifeTime *= SECS_TO_NOMINALS;
    this.remainingLifeTime = this.lifeTime;
    
    // I am not dead yet!
    this._isDeadNow = false;
};

Explosion.prototype.lifeTime = 1;
Explosion.prototype.color = "red";

Explosion.prototype.update = function (du) {

    this.backSpeed = explosionManager.backSpeed;

    this.cx -= this.backSpeed;
    this.remainingLifeTime -= du;

    if(this.remainingLifeTime<=0) {
        return explosionManager.KILL_ME_NOW;
    }

    if(this.remainingLifeTime / this.lifeTime <= 0.5) {
        this.color = "yellow";
    }
    if(this.remainingLifeTime / this.lifeTime <= 0.25) {
        this.color = "orange";
    }


    this.radius += du/4;
};

Explosion.prototype.render = function (ctx) {
    
    ctx.save();
    ctx.fillStyle = this.color;
    util.fillCircle(ctx, this.cx, this.cy, this.radius);
    ctx.restore();
};
