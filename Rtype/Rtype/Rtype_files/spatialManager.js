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
        if(e.entity.layout){
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
                return true
                
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
                return true
                
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
