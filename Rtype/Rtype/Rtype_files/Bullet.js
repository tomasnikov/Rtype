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
    //this.fireSound.play();
    if(this.isEnemyBullet){
        this.sprite = g_sprites.enemyBullet
    }

}

Bullet.prototype = new Entity();
    
// Initial, inheritable, default values
Bullet.prototype.rotation = Math.PI;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 2;
Bullet.prototype.velY = 1;
Bullet.prototype.power = 1;
Bullet.prototype.type = "Bullet";
Bullet.prototype.isEnemyBullet = false;
Bullet.prototype.spriteIter = 3.9

Bullet.prototype.wallCollide = new Audio('sounds/wallCollide.wav');

Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if(this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    //console.log(this);

    if (this.cx > g_canvas.width || this.cx < 0) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit(this.power, this.firedFrom);
        /*if (canTakeHit) {
            canTakeHit.call(hitEntity);
        }*/
        if(hitEntity.fullLife && this.firedFrom != "Enemy") {
           this.power -= hitEntity.fullLife - hitEntity.HP; 
        }
        else if(hitEntity.type != "Bullet" && hitEntity.type != "Enemy") {
            this.explode(0.5);
            this.power = 0;
            if(g_playSound) {
                this.wallCollide.play();
            }
            
        }
        if(this.power<=0) {
            return entityManager.KILL_ME_NOW;
        } 
    }
    
    spatialManager.register(this);
    if(this.isEnemyBullet){
        if(this.spriteIter-0.1 <= 0){
            this.spriteIter = this.sprite.length-0.1;
        }
        else{
            this.spriteIter -= 0.1;
        }
    }
};

Bullet.prototype.explode = function(time) {
    explosionManager.generateBulletExplosion({
        cx: this.cx,
        cy: this.cy,
        radius: this.getRadius(),
        lifeTime: time
    });
}

Bullet.prototype.getRadius = function () {
    return 4 + this.power;
};

Bullet.prototype.takeBulletHit = function () {
    //this.kill();
    
    // Make a noise when I am zapped by another bullet
};

Bullet.prototype.halt = function() {
    this.kill();
};

Bullet.prototype.reset = function() {
    this.kill();
}

Bullet.prototype.render = function (ctx) {


    var origScale = g_sprites.bullet.scale;

    if(this.isEnemyBullet){
        var width = this.sprite[0].width;
        var height = this.sprite[0].height;
        this.sprite[Math.floor(this.spriteIter)].drawCentredAt(
        ctx, this.cx - width/2, this.cy - height/2, 0
    );
    }
    else
    {
        // pass my scale into the sprite, for drawing
        g_sprites.bullet.scale = Math.max(0.2, this.power/20);
        //g_sprites.bullet.scale = this.getRadius()/10;
        g_sprites.bullet.drawCentredAt(
            ctx, this.cx, this.cy, this.rotation
        );
        g_sprites.bullet.scale = origScale;
    }

};
