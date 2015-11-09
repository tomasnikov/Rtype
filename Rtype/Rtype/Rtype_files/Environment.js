// ====
// Environment
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

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


// A generic contructor which accepts an arbitrary descriptor object
function Environment(descr) {
    console.log("halló");
    // Common inherited setup logic from Entity
    this.setup(descr);

    this.layout = levelOne;
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.environment;
    this.scale  = this.scale  || this.sprite.scale;

    this.cx = 0;
    this.imageCx = 0;
    this.cy = 0;

    console.log(this);


};

Environment.prototype = new Entity();

Environment.prototype.update = function (du) {

    spatialManager.unregister(this);   
    this.cx -= du;
    this.imageCx -= du/1.5;
    

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
    this.evaporateSound.play(); 
    }
    return power-origHP;    
};

Environment.prototype.reset = function() {
    this.cx = 0;
    this.imageCx = 0;
}


Environment.prototype.render = function (ctx) {
    ctx.save();
    ctx.fillStyle = "blue";
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

    ctx.restore();

    
};
