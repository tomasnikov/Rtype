// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {

    entityManager.generateShip({
        type: "Ship",
        cx : 100,
        cy : 300
    });
    
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC
function updateMenu(du) {
    g_menu.update(du);
}
function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

    explosionManager.update(du);

    // Prevent perpetual firing!
    // eatKey(Ship.prototype.KEY_FIRE);
    //console.log("Ate key");
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');
var KEY_PLAY = keyCode('7');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleEnemies();
    if (eatKey(KEY_PLAY)) g_doRenderMenu = !g_doRenderMenu;

    /*
    if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship});

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship2
        });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
    */
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING
function renderMenu(ctx){
    g_menu.render(ctx)
}
function renderSimulation(ctx) {
    entityManager.render(ctx);

    explosionManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        ship   : "Sprites/r-typesheet42.gif",//"Sprites/Spaceship_art_pack_larger/Blue/Small_ship_blue/1.png",
        enemy   : "Sprites/r-typesheet5.gif",//"Sprites/copterAlien.gif",
        environment1 : "Sprites/environment1.png",
        environment2 : "Sprites/environment2.png",
        bullet : "Sprites/Spaceship_art_pack_larger/Blue/bullet.png",
        space : "space.jpg",
        logo : "Sprites/r-type-logo.png"

    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var g_menu
var g_levelManager
function uploadEnemySpritesheet(){
    g_sprites.enemy = []
    var xDim = Math.floor(g_images.enemy.width / 16) //width / nr pictures
    for(var i = 0; i < 8; i++){ // 8 because there are 8 "poses we need"
        g_sprites.enemy.push(new SpriteSheet(g_images.enemy, 1, i*xDim, 0, xDim, 36));
    }
}
function uploadShipSpritesheet(){
    g_sprites.ship = [];
    var xDim = Math.floor(g_images.ship.width / 5)
    var height = g_images.ship.height / 5
    for(var i = 0; i < 5; i++){
        g_sprites.ship.push(new SpriteSheet(g_images.ship, 1, i*xDim, 0 ,xDim, height))
    }
    console.log(g_sprites.ship)
}
function preloadDone() {
    //g_sprites.ship  = new Sprite(g_images.ship, 0.1);
    //g_sprites.enemy  = new Sprite(g_images.enemy, 0.33);
    uploadShipSpritesheet();
    uploadEnemySpritesheet();
    g_sprites.environment1 = new Sprite(g_images.environment1, 1);
    g_sprites.environment2 = new Sprite(g_images.environment2, 1);
    g_sprites.bullet = new Sprite(g_images.bullet, 1);
    g_sprites.logo = new Sprite(g_images.logo, 1)
    g_sprites.bullet.scale = 0.25;
    //entityManager.init();
    //createInitialShips();
    g_levelManager = new LevelManager();
    g_menu = new MainMenu();
    main.init();
}

// Kick it off
requestPreloads();