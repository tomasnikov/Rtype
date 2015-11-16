/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    return this._nextSpatialID++;

},

register: function(entity) {
    var pos = entity.getPos();
    var radius = entity.getRadius();
    var spatialID = entity.getSpatialID();
    
    this._entities[spatialID] = {
        posX: pos.posX,
        posY: pos.posY,
        radius: radius,
        entity: entity
    };
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    delete this._entities[spatialID]; 
    
},

findEntityInRange: function(posX, posY, radius) {
    for(var ID in this._entities) {
        var e = this._entities[ID];
        var distBetweenEntities = util.wrappedDistSq(e.posX, e.posY, posX, posY);
        var minDist = util.square(e.radius + radius);
        if(e.entity.type=="Environment"){
            if (this.collisionWithEnvironment(posX, posY, radius, e.entity)){
                return e.entity;
                console.log("collision!")
            }
        }
        if(distBetweenEntities < minDist && distBetweenEntities!==0) {
            return e.entity;
        }
    }
},

computeNextEnemyMove: function(posX, posY, radius, velX, velY) {
    for(var ID in this._entities) {
        var e = this._entities[ID];
        if(e.entity.type=="Environment") {
            var environment = e.entity;
        }
        if(e.entity.type=="Ship") {
            var ship = e.entity;
        }
    }
    if(environment) {
        var width = environment.brickWidth;
        var height = environment.brickHeight;
        var possPos = [
            [posX + width, posY],
            [posX + 2*width, posY],
            [posX, posY - height],
            [posX, posY + height],
            [posX + width, posY - height],
            [posX + width, posY + height],
            [posX + 2*width, posY - height],
            [posX + 2*width, posY + height],
            [posX, posY - 2*height],
            [posX, posY + 2*height]
        ];

        for(var i = 0; i<possPos.length; i++) {
            util.fillCircle(g_ctx, possPos[i][0], possPos[i][1], radius);
        }

        var velocity = velY;
        var isNegative = velocity>0;
        var multiplier = 1;

        var collidesFront1 = this.collisionWithEnvironment(possPos[0][0], possPos[0][1], radius, environment);
        var collidesFront2 = this.collisionWithEnvironment(possPos[1][0], possPos[1][1], radius, environment);
        var collidesTop0 = this.collisionWithEnvironment(possPos[2][0], possPos[2][1], radius, environment);
        var collidesTop1 = this.collisionWithEnvironment(possPos[3][0], possPos[3][1], radius, environment);
        var collidesTop2 = this.collisionWithEnvironment(possPos[4][0], possPos[4][1], radius, environment);
        var collidesBottom0 = this.collisionWithEnvironment(possPos[5][0], possPos[5][1], radius, environment);
        var collidesBottom1 = this.collisionWithEnvironment(possPos[6][0], possPos[6][1], radius, environment);
        var collidesBottom2 = this.collisionWithEnvironment(possPos[7][0], possPos[7][1], radius, environment);
        var collidesTopTop = this.collisionWithEnvironment(possPos[8][0], possPos[8][1], radius, environment);
        var collidesBottomBottom = this.collisionWithEnvironment(possPos[9][0], possPos[9][1], radius, environment);
        console.log("top", collidesTop0, collidesTop1, collidesTop2);
        console.log("front", collidesFront1, collidesFront2);
        console.log("bottom", collidesBottom0, collidesBottom1, collidesBottom2);

        if(collidesFront1 == "top" 
            || collidesFront2 == "top" 
            || collidesTop2 
            || collidesTop1 
            || collidesTop0
            //|| collidesTopTop
            ) {
                console.log("top collision");
                return isNegative ? velY : velY*-1*multiplier;
        }
        if(collidesFront1 == "bottom" 
            || collidesFront2 == "bottom" 
            || collidesBottom2 
            || collidesBottom1 
            || collidesBottom0
            //|| collidesBottomBottom
            ) {
                console.log("bottom collision");
                return isNegative ? velY*-1*multiplier : velY;
        }
    }
    if(ship) {
        var distY = ship.cy - posY;
        console.log("dist", distY);
        if(distY>radius && !isNegative) {
            return velY*-0.75;
        }
        else if(distY<-radius && isNegative) {
            return velY*-0.75;
        }
    }

    return velY;
    

},

collisionWithEnvironment: function(posX, posY, radius, entity){
    var width = entity.brickWidth;
    var height = entity.brickHeight;
    var environmentdu = entity.cx
    var arrayCoordX = Math.floor((-environmentdu+posX)/width); //index of brick in environment to check
    var posCoordX = Math.floor((posX)/width); 

    //var arrayCoordY = Math.floor(posY/height);
    for(var i = 0; i < entity.layout.top.length; i++){
        for(var j = -1; j < 2; j++){
            if(arrayCoordX == 0){j=0;}
            var brickcy = i*height + height/2;
            var brickcx = (arrayCoordX+j)*width + environmentdu + width/2;
            if(entity.layout.top[i][arrayCoordX+j] != 0 
                && util.squareCircleCollision(brickcx, brickcy, width, height, posX, posY, radius)){
                return "top"
                
            }
        }
    }
    for(var i = 0; i < entity.layout.bottom.length; i++){
        for(var j = -1; j < 2; j++){
            if(arrayCoordX == 0){j=0;}
            var brickcy = g_canvas.height - (2-i)*height - height/2;
            var brickcx = (arrayCoordX+j)*width+ environmentdu + width/2;
            if(entity.layout.bottom[i][arrayCoordX+j] != 0 
                && util.squareCircleCollision(brickcx, brickcy, width, height, posX, posY, radius)){
                return "bottom"
                
            }
        }
    }
    return false
},
render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    for (var ID in this._entities) {
        var e = this._entities[ID];
        if(e.entity.layout) {
            for(var i = 0; i < e.entity.layout.top.length; i++) {
                for(var j = 0; j<e.entity.layout.top[i].length; j++) {
                    if(e.entity.layout.top[i][j]!=0) {
                        util.strokeRectangle(ctx,
                         e.posX + e.entity.sprite.width/2 + j*e.entity.sprite.width,
                         e.entity.sprite.height/2 + i*e.entity.sprite.height,
                         e.radius, e.radius);
                    }
                }
            }
            for(var i = 0; i < e.entity.layout.bottom.length; i++) {
                for(var j = 0; j<e.entity.layout.bottom[i].length; j++) {
                    if(e.entity.layout.bottom[i][j]!=0) {
                        util.strokeRectangle(ctx,
                         e.posX + e.entity.sprite.width/2 + j*e.entity.sprite.width,
                         g_canvas.height + e.entity.sprite.height/2 -(e.entity.layout.bottom.length-i)*e.entity.sprite.height,
                         e.radius, e.radius);
                    }
                }
            }
        }
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
