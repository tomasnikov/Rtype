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
        //console.log(distBetweenEntities, minDist);
        if(distBetweenEntities < minDist && distBetweenEntities!==0) {
            return e.entity;
        }
    }
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    for (var ID in this._entities) {
        var e = this._entities[ID];
        if(e.entity.layout) {
            for(var i = 0; i < e.entity.layout.length; i++) {
                for(var j = 0; j<e.entity.layout[i].length; j++) {
                    if(i<3 && e.entity.layout[i][j]!=0) {
                        util.strokeCircle(ctx,
                         e.posX + e.entity.sprite.width/2 + j*e.entity.sprite.width,
                         e.entity.sprite.height/2 + i*e.entity.sprite.height,
                         e.radius);
                    }
                    else if(e.entity.layout[i][j]!=0){
                        util.strokeCircle(ctx,
                         e.posX + e.entity.sprite.width/2 + j*e.entity.sprite.width,
                         g_canvas.height + e.entity.sprite.height/2 -(e.entity.layout.length-i)*e.entity.sprite.height,
                         e.radius);
                    }
                }
            }
        }
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
