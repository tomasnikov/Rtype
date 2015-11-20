function LevelManager() {
	this.level = 1,
	
	this.top= [
		[
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		],
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
	    
	    [
	    	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	        [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0],
	        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
		],
	    [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
        ],
    ],
    this.bottom = [
		[
		  	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    		[0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  
		],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
	    
	    [
	    	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    		[0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		],
	    [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    ],
    this.environmentSprites = [
		g_sprites.environment4,
		g_sprites.environment2,
		g_sprites.environment1,
		g_sprites.environment3,
	],
    this.nrLevels = this.top.length,

    this.bosses = [
    	{
    		sprite: g_sprites.boss,
    		isBoss: true,
    		cx: g_canvas.width,
    		cy: g_canvas.height/2,
    		diff: 0,
    		fullLife: 15,
            HP: 15,
    		shootTimer: 0.2,
    		shouldIterSprite: 50,
    		shouldIterSpriteOrig: 50
    	},
    	{
    		sprite: g_sprites.boss,
    		isBoss: true,
    		cx: g_canvas.width,
    		cy: g_canvas.height/2,
            diff: 0,
    		fullLife: 20,
            HP: 20,
    		shootTimer: 0.15,
    		shouldIterSprite: 50,
    		shouldIterSpriteOrig: 50
    	},
    	{
    		sprite: g_sprites.boss,
    		isBoss: true,
    		cx: g_canvas.width,
    		cy: g_canvas.height/2,
            diff: 0,
    		fullLife: 25,
            HP: 25,
    		shootTimer: 0.1,
    		shouldIterSprite: 50,
    		shouldIterSpriteOrig: 50
    	},
    	{
    		sprite: g_sprites.boss,
    		isBoss: true,
    		cx: g_canvas.width,
    		cy: g_canvas.height/2,
            diff: 0,
    		fullLife: 30,
            HP: 30,
    		shootTimer: 0.05,
    		shouldIterSprite: 50,
    		shouldIterSpriteOrig: 50
    	}
    ]
    this.enemies = [
    	
            {
                sprite: [g_sprites.enemy1, g_sprites.enemy4],
                numEnemies: [4,4],
                fullLife: [1,2],
                velX: [-210, -210]
            },
            {
                sprite: [g_sprites.enemy1, g_sprites.enemy2],
                 numEnemies: [4,1],
                 fullLife: [1,3],
                 velX: [-220, -220],
                 shouldIterSprite: [4,30],
                shouldIterSpriteOrig: [4,30]
            },
            {
                sprite: [g_sprites.enemy4, g_sprites.enemy5],
                numEnemies: [4,6],
                fullLife: [2,1],
                velX: [-230, -230]
            },
    	    {
                sprite: [g_sprites.enemy2, g_sprites.enemy5],
                numEnemies: [1,6],
                fullLife: [3,1],
                velX: [-250, -250],
                shouldIterSprite: [30,4],
                shouldIterSpriteOrig: [30,4]
            }   
    ],

    this.backGrounds = [
        {
            img: g_images['space'],
            cxOffset: 0,
            cyOffset: -300
        },
        {
            img: g_images['space2'],
            cxOffset: 200,
            cyOffset: 0
        },
        {
            img: g_images['space3'],
            cxOffset: 0,
            cyOffset: -600
        },
        {
            img: g_images['space4'],
            cxOffset: 0,
            cyOffset: 0
        }
    ];
}
LevelManager.prototype.getEnemyDescr = function(num) {
    var obj = {};
    var descr = this.enemies[this.level];
    for (var property in descr) {
        obj[property] = descr[property][num];
    }
	return obj;
}
LevelManager.prototype.setLevel = function(newLevel){
	this.level = newLevel;
}
LevelManager.prototype.increaseLevel = function(){
	this.level++;
	entityManager.resetEntities();
}
LevelManager.prototype.getEnvironment = function(){ 
    return {top: this.top[this.level], bottom: this.bottom[this.level]};
}
LevelManager.prototype.getEnvironmentSprite = function(){
	return this.environmentSprites[this.level];
}

LevelManager.prototype.getBackground = function() {
    return this.backGrounds[this.level];
}

LevelManager.prototype.getBossDetails = function() {

	var boss = this.bosses[this.level];
	
	return boss; 
}