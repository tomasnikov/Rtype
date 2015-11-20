// ====
// Environment
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
/*
var levelOne = {
    top: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    bottom: [
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
};
*/

// A generic contructor which accepts an arbitrary descriptor object
function Environment(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);

    this.layout = g_levelManager.getEnvironment()//levelOne;
    // Default sprite and scale, if not otherwise specified
    //this.sprite = this.sprite || g_sprites.environment;
    this.sprite = this.sprite || g_levelManager.getEnvironmentSprite();
    this.scale  = this.scale  || this.sprite.scale;

    this.cx = 0;
    this.imageCx = 0;
    this.cy = 0;

    this.brickWidth = this.sprite.width;
    this.brickHeight = this.sprite.height;

    this.scrollSpeed = this.brickWidth/(g_canvas.width/20);
    this.origScrollSpeed = this.scrollSpeed;

    this.spawnEnemyTimer *= SECS_TO_NOMINALS;
    this.origEnemyTimer *= SECS_TO_NOMINALS;

    this.maxScrolled = this.brickWidth*(this.layout.top[0].length-Math.ceil(g_canvas.width/this.brickWidth));

};

Environment.prototype = new Entity();

Environment.prototype.type = "Environment";
Environment.prototype.spawnEnemyTimer = 0;
Environment.prototype.origEnemyTimer = 2;

Environment.prototype.update = function (du) {


    spatialManager.unregister(this);

    if(this.cx <= -this.maxScrolled && this.scrollSpeed) {
        this.scrollSpeed = 0;
        entityManager.generateBoss(g_levelManager.getBossDetails());
    }
    explosionManager.backSpeed = this.scrollSpeed;

    if(this.scrollSpeed) {
        this.spawnEnemyTimer -= du;
    }
    

    if(this.spawnEnemyTimer <= 0) {
        var rand = Math.floor(Math.random() * 2);
        var enemyDescr = g_levelManager.getEnemyDescr(rand);
        entityManager._generateEnemies(enemyDescr);
        this.spawnEnemyTimer = this.origEnemyTimer;
    }

    this.cx -= this.scrollSpeed;
    this.imageCx -= this.scrollSpeed/1.5;
    

    spatialManager.register(this);      

};

Environment.prototype.getRadius = function () {
    return this.sprite.width/2;
};

Environment.prototype.takeBulletHit = function (power) {
    var origHP = this.hp;
    this.HP = this.HP - power > 0 ? this.HP - power : 0;
    if(this.HP <= 0) {
       this.kill();
    //this.evaporateSound.play(); 
    }
    return power-origHP;    
};

Environment.prototype.halt = function() {
    this.scrollSpeed = 0;
};

Environment.prototype.reset = function() {
    this.cx = 0;
    this.imageCx = 0;
    this.scrollSpeed = this.origScrollSpeed;
    this.layout = g_levelManager.getEnvironment()
    this.sprite = g_levelManager.getEnvironmentSprite();

};

Environment.prototype.render = function (ctx) {
    var width = this.sprite.width;
    var height = this.sprite.height;
    for(var i = 0; i < this.layout.top.length; i++) {
        for(var j = 0; j<this.layout.top[i].length; j++) {
            if(this.layout.top[i][j]!=0) {
                this.sprite.drawCentredAt(ctx, this.cx + width/2 + j*width, height/2 + i*height); 
            }         
        }
    }

    for(var i = 0; i < this.layout.bottom.length; i++) {
        for(var j = 0; j<this.layout.bottom[i].length; j++) {
            if(this.layout.bottom[i][j]!=0) {
                this.sprite.drawCentredAt(ctx, this.cx + width/2 + j*width, g_canvas.height + height/2 -(this.layout.bottom.length-i)*height);
            }         
        }
    } 

    util.fillBox(ctx, 0, g_canvas.height-this.brickHeight/2, g_canvas.width, this.brickHeight/2, "black");    
};
