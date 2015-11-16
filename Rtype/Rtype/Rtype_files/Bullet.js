// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    this.fireSound.play();
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/
}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Bullet.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Bullet.prototype.rotation = Math.PI;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 2;
Bullet.prototype.velY = 1;
Bullet.prototype.power = 1;


Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if(this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    //console.log(this);

    if (this.cx > g_canvas.width) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit(this.power);
        if (canTakeHit) {
            canTakeHit.call(hitEntity);
        } 
        if(hitEntity.fullLife) {
           this.power -= hitEntity.fullLife - hitEntity.HP; 
        }
        else {
            this.power = 0;
        }
                if(this.power<3) return entityManager.KILL_ME_NOW;
    }
    
    spatialManager.register(this);

};

Bullet.prototype.getRadius = function () {
    return 4 + this.power;
};

Bullet.prototype.takeBulletHit = function () {
    //this.kill();
    
    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

Bullet.prototype.reset = function() {
    this.kill();
}

Bullet.prototype.render = function (ctx) {


    var origScale = g_sprites.bullet.scale;


    // pass my scale into the sprite, for drawing
    g_sprites.bullet.scale = Math.max(0.2, this.power/20);
    //g_sprites.bullet.scale = this.getRadius()/10;
    g_sprites.bullet.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    g_sprites.bullet.scale = origScale;

};
