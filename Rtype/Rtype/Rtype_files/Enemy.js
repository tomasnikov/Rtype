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
    this.sprite = this.sprite || g_sprites.enemy1;
    this.scale  = this.scale  || this.sprite[0].scale;
    this.diff = 2*this.getRadius()*1.3*this.diff;
    this.setPosition();
    this.setVelocity();
    
    this.HP = this.fullLife;

    this.points = 50*this.fullLife;
    this.spritecnt = 0;

    if(this.isBoss) {
        this.shootTimer *= SECS_TO_NOMINALS;
        this.origShootTimer = this.shootTimer;
    }
};

Enemy.prototype = new Entity();
Enemy.prototype.shouldIterSprite = 4;
Enemy.prototype.shouldIterSpriteOrig = 4;
Enemy.prototype.launchVel = 3;
Enemy.prototype.moving = 0;
Enemy.prototype.type = "Enemy";
Enemy.prototype.fullLife = 1;
Enemy.prototype.bulletChance = 0.002;

Enemy.prototype.wallCollide = new Audio('sounds/wallCollide.wav');
Enemy.prototype.shootSound = new Audio('sounds/enemyShoot.wav');
Enemy.prototype.bossDeath = new Audio('sounds/vaderNo.wav');
Enemy.prototype.death = new Audio('sounds/enemyDeath.wav');

Enemy.prototype.setPosition = function () {
    var radius = this.getRadius();
    this.cx = this.cx || g_canvas.width-radius + this.diff;
    var minBottom = radius + 50;
    var maxTop = g_canvas.height - radius - 50;
    this.cy = this.cy || g_canvas.height/2;
    this.rotation = this.rotation || 0;
    this.origCx = this.cx;
    this.origCy = this.cy;
};

Enemy.prototype.setVelocity = function () {

    this.velX = this.velX/SECS_TO_NOMINALS || -225/SECS_TO_NOMINALS;
    this.velY = this.velX*0.5;
    this.origVelY = this.velY;

    this.velRot = this.velRot || 0;
};


Enemy.prototype.update = function (du) {

    spatialManager.unregister(this);

    var collided = this.isColliding();
    if(collided && collided.firedFrom != "Enemy" && collided.firedFrom != 'Ship') {
        if(this.boss) {
            console.log("collided");
        }
        
        this.kill();
    }

    if(this._isDeadNow) {
        this.explode(0.4);
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
    else if(this.moving<=0) {
        var movement = spatialManager.computeNextEnemyMove(this.cx, this.cy, this.getRadius(), this.origVelY, this.velY);
        this.velY = movement.velY;
        this.moving = movement.timeMoving;
    }
    else {
        this.moving -= du;
    }

    if(this.isBoss && this.cx < g_canvas.width-this.getRadius()) {
        this.velX = 0;
    }

    this.cx += this.velX * du;

    if(this.isBoss) {
        this.shootTimer -= du;
    }

    if(this.cx < g_canvas.width && this.cx > 0) {
       this.maybeFireBullet(); 
    }
    
    this.cy += this.velY * du;

    if(this.cx<-this.getRadius()) {
        this.kill();
    }

    this.rotation += 1 * this.velRot;

    spatialManager.register(this);

    if(this.shouldIterSprite == 0){
        this.nextSprite();
        this.shouldIterSprite = this.shouldIterSpriteOrig;
    }
    else{
        this.shouldIterSprite--;
    }
};

Enemy.prototype.getRadius = function () {
    return this.scale * (this.sprite[0].width / 2) * 0.7;
};

Enemy.prototype.maybeFireBullet = function() {
    var shouldFireBullet = Math.random();
    if(this.isBoss) {
        if(this.shootTimer<=0) {
            this.fireBullet();
            this.shootTimer = this.origShootTimer;  
        }
        
    }
    else if(shouldFireBullet<this.bulletChance) {
        this.fireBullet();
    }
};

Enemy.prototype.fireBullet = function() {
    if(this.isBoss){
        if(this.spritecnt == 2 || this.spritecnt == 0){
            var launchDist = this.getRadius();
            entityManager.fireBulletAtShip(
                this.cx - launchDist, this.cy,
                this.velX - this.launchVel, this.velY,
            -Math.PI/2, "Enemy");
        }
    }
    else{
        if(g_playSound) {
            this.shootSound.play();
        }
        var launchDist = this.getRadius();
        entityManager.fireBulletAtShip(
           this.cx - launchDist, this.cy,
           this.velX - this.launchVel, this.velY,
           -Math.PI/2, "Enemy");
    }
}

Enemy.prototype.takeBulletHit = function (power, firedFrom) {
    if(firedFrom === "Ship") {
        var origHP = this.HP;
        this.HP = this.HP - power > 0 ? this.HP - power : 0;
        if(this.HP <= 0) {
            this.kill(this.points);
            if(this.isBoss) {
                if(g_levelManager.level == 3){
                    g_menu.message = "Congratulations!"
                    main.toggleMenu();
                }
                else{
                    if(g_playSound) {
                      this.bossDeath.play();  
                    }
                    setTimeout(function() {
                        g_levelManager.increaseLevel();
                    }, 3000);
                    
                }
            }
            else if(g_playSound) {
                this.death.play();
            }
        }
        var random = Math.random();
        if(random<0.1 && !this.isBoss && this._isDeadNow) {
            var randomType = Math.random();
            var type;
            //HP++
            if(randomType < 0.05) type = 1;
            //Forcefield
            else if(randomType < 0.4) type = 2;
            //Multishot
            else if(randomType < 0.75) type = 3;
            //Small ship
            else type = 0;
            powerupManager.generatePowerup({
            cx: this.cx,
            cy: this.cy,
            type: type
        });
        }
        
        return power-origHP;  
    }
      
};

Enemy.prototype.explode = function(time) {
    explosionManager.generateEnemyExplosion({
        cx: this.cx,
        cy: this.cy,
        radius: this.getRadius()/3,
        lifeTime: time
    });
}

Enemy.prototype.halt = function() {
    this.kill();
};

Enemy.prototype.reset = function() {
    this.kill();
};

Enemy.prototype.nextSprite = function (){
    if(this.spritecnt + 1 == this.sprite.length){
        this.spritecnt =0
    }
    else{
        this.spritecnt++
    }

}

Enemy.prototype.render = function (ctx) {
    var width = this.sprite[0].width;
    var height = this.sprite[0].height;
    this.sprite[this.spritecnt].drawCentredAt(
        ctx, this.cx - width/2, this.cy - height/2, 0
    );
};
