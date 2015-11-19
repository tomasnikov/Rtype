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
    this.sprite = g_sprites.explosion;
    this.spriteIter = 0;

};

Explosion.prototype.lifeTime = 0.1;
Explosion.prototype.color = "red";
Explosion.prototype.spriteIter = 4;
Explosion.prototype.spriteIterOrig = 4;
Explosion.prototype.spriteItercnt = 0
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
    if(this.shouldIterSprite == 0){
        this.nextSprite();
        this.shouldIterSprite = this.shouldIterSpriteOrig;
    }
    else{
        this.shouldIterSprite--;
    }
    this.spriteItercnt++
    this.radius += du/4;
    var spriteIterLimit = this.lifeTime / this.sprite.length

    if(this.spriteIter+1<this.sprite.length && this.spriteItercnt > spriteIterLimit){
        this.spriteIter++
        this.spriteItercnt = 0
    }
};

Explosion.prototype.render = function (ctx) {
    var width = this.sprite[0].width;
    var height = this.sprite[0].height;
    this.sprite[this.spriteIter].drawCentredAt(
        ctx, this.cx - width/2, this.cy - height/2, 0
    );
    /*
    ctx.save();
    ctx.fillStyle = this.color;
    util.fillCircle(ctx, this.cx, this.cy, this.radius);
    ctx.restore();
    */
};
