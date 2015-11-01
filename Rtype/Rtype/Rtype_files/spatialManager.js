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

    // TODO: YOUR STUFF HERE!

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
    // TODO: YOUR STUFF HERE!

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    delete this._entities[spatialID]; 
    
    // TODO: YOUR STUFF HERE!

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
    // TODO: YOUR STUFF HERE!

},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
