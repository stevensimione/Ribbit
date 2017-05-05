/// <reference path="phaser.js" />
var top_down = top_down || {};

top_down.Game = function(){};

var gameState = null;

var backgroundImage;

var homeMenu;
var playGame;
var controls;
var greenVolume;
var greenHelp;

var level;
var locked = [12];

var gameMenu;
var menuButton;
var resumeButton;
var helpButton;
var volumeButton;
var restartButton;
var levelSelect;
var helpMenu;
var background;
var popup;
var logo;
var home;

var lastClickTime = 0;

var wKey;
var aKey;
var sKey;
var dKey;
var eKey;
var spaceKey;

var key1;
var key2;
var key3;
var key4;
var key5;
var key6;
var key7;
var key8;
var key9;
var keyI;
var keyO;
var keyP;

var frogSpawnX = null;
var frogSpawnY = null;
var frog;
var tongue;
var tongueMarker;

var flag = true;


var rockGroup;
var tongueArray = [];

var anchorX = -1;
var anchorY = -1;

var tongueAnchored;
var tongueBeingRetracted;
var constraints = [];

var frogCG;
var blockedCG;
var markerCG;
var rockCG;

var currentMarker;

var marker;
var markerGroup;
var distanceBetweenFrogAndRock;
var wallAnchor;

var markerX;
var markerY;

var tongueOut;

var fly1;
var fly2;

var currentLevel;

var blockedLayerTiles = null;

var fire;
var fireGroup;

var gamePreviouslyInit = false;

//castle Kevin
var castle;

function updateTonguePoints(){
	var startX = frog.x + 20;
	var startY = frog.y + 20;
	var dx;
	var dy;
	if(tongueAnchored && tongueOut){
		dx = (startX - wallAnchor.x);
		dy = (startY - wallAnchor.y);
	} else {
		if(marker != undefined){
			dx = (startX - marker.x);
			dy = (startY - marker.y);
		} else {
			dx = 20;
			dy = 20;
		}
	}
	
	if(!tongueOut){
		dx = 20;
		dy = 20;
	}
	
	tongue.reset(frog.x + 20, frog.y + 20);
	tongueArray[0].x = -20;
	tongueArray[0].y = -20;
	tongueArray[1].x = -dx;
	tongueArray[1].y = -dy;
}

function screenReleased(){
	tongueBeingRetracted = true;
}

function screenClicked(){
	var currentTime = new Date();
	
	if(currentTime.getTime() - lastClickTime < top_down.game.input.doubleTapRate){
		doubleClicked();
	}
	lastClickTime = currentTime;
	var clickedWorldX = getClickedWorldX();
	var clickedWorldY = getClickedWorldY();
	console.log("x:" + clickedWorldX + ", y:" + clickedWorldY);
}

function getClickedWorldX(){return top_down.game.input.x + top_down.game.camera.x;}

function getClickedWorldY(){return top_down.game.input.y + top_down.game.camera.y;}

function clearConstraints(){
	for(var i = 0; i < constraints.length; i++){
		top_down.game.physics.p2.removeConstraint(constraints[i]);
	}
	constraints = [];	
}

function markerHitBlock(marker, block){
	tongueBeingRetracted = true;
}

function markerHitRock(marker, rock){
	rock.clearCollision();
	if(curRock == null){
			
	} else {
		markerX = rock.x;
		markerY = rock.y;
		marker.clearCollision();
		marker.sprite.kill();
		wallAnchor = markerGroup.create(markerX, markerY, 'ttongue');
		top_down.game.physics.p2.enable(wallAnchor);
		wallAnchor.body.static = true;
		tongueAnchored = true;
		//console.log("markerHitRock Tongue Anchored");
		distanceBetweenFrogAndRock = Math.sqrt(((rock.x - frog.x)*(rock.x - frog.x)) + ((rock.y - frog.y)*(rock.y - frog.y)));
	}
	markerGroup.removeAll();
}

function moveObjToObj(obj1, obj2, speed){
	var angle = Math.atan2(obj2.y - obj1.body.y, obj2.x - obj1.body.x)
	obj1.body.velocity.x = Math.cos(angle) * speed;
	obj1.body.velocity.y = Math.sin(angle) * speed;
	if(obj1.overlap(obj2)){
		return true;
	}
	return false;
}

function moveObjToXY(obj, x, y, speed){
	var angle = Math.atan2(y - obj.body.y, x - obj.body.x)
	obj.body.velocity.x = Math.cos(angle) * speed;
	obj.body.velocity.y = Math.sin(angle) * speed;
}

function removeCollisionFromAllRocks(){
	console.log(curRock);
	for(var i = 0; i < rockGroup.children.length; i++){
		rockGroup.children[i].body.clearCollision();
	}

}

function shootMarker(destX, destY){
	tongueOut = true;
	tongueAnchored = false;
	/*
	for(var i = 0; i < markerGroup.length; i++){
		markerGroup.remove(markerGroup.getAt(i));
	}
	*/
	
	//markerGroup.removeAll();	
	
	
	
	
	marker = markerGroup.create(frog.x, frog.y, 'ttongue', 1);
	top_down.game.physics.p2.enable(marker);
	var markerAngle = Math.atan2(top_down.game.camera.y + destY - frog.y, top_down.game.camera.x + destX - frog.x);
	marker.body.angle = markerAngle;
	marker.body.setCollisionGroup(markerCG);
	
	marker.body.collides([rockCG]);
	marker.body.collides([blockedCG]);
	marker.body.createGroupCallback(rockCG, markerHitRock, this);
	marker.body.createGroupCallback(blockedCG, markerHitBlock, this);
	marker.body.data.gravityScale = 0;
	moveObjToXY(marker, destX, destY, 800);
}
var curRock = null;

function rockClicked(rock){
	
	var currentTime = new Date();
	//console.log("ROCK CLICKED");
	//if(currentTime.getTime() - lastClickTime < top_down.game.input.doubleTapRate){}
		if((curRock != rock) || (curRock == null)){		
			console.log("STEVE THIS");
			if(!mute)
				tongueSound.play();
			rock.body.setCollisionGroup(rockCG);
			rock.body.collides([markerCG])
			//shootMarker(getClickedWorldX(), getClickedWorldY());
			shootMarker(rock.x, rock.y);
			curRock = rock;
		} else {
			/*
			if(!mute)
			releaseSound.play();
			shootMarker(getClickedWorldX(), getClickedWorldY());
			tongueBeingRetracted = true;
			curRock = null;
			*/
		}
}

function frogWins(){
	alert("You have won!\nTry out another level.");
}

function frogDies(){
	alert("You have died.\nGame will now restart.");
}

function initRocks(rockLayerData){
	var rockPlacement = [];//[200, 1400, 600, 1400, 400, 1200, 500, 1100, 944, 1236, 886, 981, 553, 750, 1325, 660, 1107, 462, 1436, 280, 870, 1149];
	for(var i = 0; i < rockLayerData.data.length; i++){
			if(rockLayerData.data[i] != 0){
				if(rockLayerData.data[i] == 21){
					frogSpawnX = (i%rockLayerData.width) * 16;
					frogSpawnY = (Math.floor(i/rockLayerData.width)) * 16;
				}
                
				if(rockLayerData.data[i] == 22){
					spawnFire((i%rockLayerData.width) * 16, (Math.floor(i/rockLayerData.width)) * 16, "fire");
				}

				if(rockLayerData.data[i] == 10){
                    castle= spawnCastle((i%rockLayerData.width) * 16,(Math.floor(i/rockLayerData.width)) * 16);
				}
				if(rockLayerData.data[i] == 3){
					rockPlacement.push((i%rockLayerData.width) * 16);
					rockPlacement.push((Math.floor(i/rockLayerData.width)) * 16);
				}
            }
	}
	rockGroup = top_down.game.add.group();
	var tempRock;		
	for(var i = 0; i < rockPlacement.length; i += 2){
		var rockType = '0';
		rockType = Math.floor(Math.random() * 3) + 1;
		tempRock = rockGroup.create(rockPlacement[i], rockPlacement[i+1], 'rockA' + rockType)
		top_down.game.physics.p2.enable(tempRock);
		tempRock.inputEnabled = true;
		tempRock.enableBody = true;
		tempRock.body.static = true;
		tempRock.events.onInputDown.add(rockClicked, this);
		top_down.game.physics.p2.enable(tempRock);
	}
}

function tongueGone(){
	marker.x = frog.x;
	marker.y = frog.y;
	tongueOut = false;
	tongueBeingRetracted = false;
	tongueArray[1].x = 20;
	tongueArray[1].y = 20;
	markerGroup.removeAll();
	//curRock = null;
	//console.log("curRock: " + curRock);
}

function initControls(){
	wKey = top_down.game.input.keyboard.addKey(Phaser.Keyboard.W);
	aKey = top_down.game.input.keyboard.addKey(Phaser.Keyboard.A);
	sKey = top_down.game.input.keyboard.addKey(Phaser.Keyboard.S);
	dKey = top_down.game.input.keyboard.addKey(Phaser.Keyboard.D);
    spaceKey = top_down.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	key1 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	key2 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	key3 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
	key4 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
	key5 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
	key6 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.SIX);
	key7 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
	key8 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
	key9 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.NINE);
	key10 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.I);
	key11 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.O);
	key12 = top_down.game.input.keyboard.addKey(Phaser.Keyboard.P);
	/*spaceKey.addCallbacks(this, null, null, function(){
});
	*/
	//spaceKey.onHoldCallback.push(function(){});
	//console.log(spaceKey.onHoldCallback);
	// To test opening mouth
    xKey = top_down.game.input.keyboard.addKey(Phaser.Keyboard.X);
	eKey = top_down.game.input.keyboard.addKey(Phaser.Keyboard.E);
	
}

/*called by update function to check/handle any controls being pressed*/
var singlePress = true;
var singlePressLevel = true;

function checkControls(){
		/*
		if(wKey.isDown){
			top_down.game.camera.y -= 10;
		}
		if(aKey.isDown){
			top_down.game.camera.x -= 10;
			//frog.body.velocity.x = 0
		}
		if(sKey.isDown){
			top_down.game.camera.y += 10;
			//frog.body.velocity.x = 100;
		}
		if(dKey.isDown){
			top_down.game.camera.x += 10;
		}
		
		
		if(singlePressLevel){
			if(key1.isDown){
				createGame(1);
			} else if(key2.isDown){
				createGame(2);
			} else if(key3.isDown){
				createGame(3);
			} else if(key4.isDown){
				createGame(4);
			} else if(key5.isDown){
				createGame(5);
			} else if(key6.isDown){
				createGame(6);
			} else if(key7.isDown){
				createGame(7);
			} else if(key8.isDown){
				createGame(8);
			} else if(key9.isDown){
				createGame(9);
			} else if(key10.isDown){
				createGame(10);
			} else if(key11.isDown){
				createGame(11);
			} else if(key12.isDown){
				createGame(12);			
			} else if (eKey.isDown){
			}
			singlePressLevel = false;
		} else {
			if(!key1.isDown && !key2.isDown && !key3.isDown && !key4.isDown && !key5.isDown && !key6.isDown && !key7.isDown && !key8.isDown && !key9.isDown && !key10.isDown && !key11.isDown && !key12.isDown && !eKey.isDown){
				singlePressLevel = true;
			}		
		}
		
        // testng open mouth
        if(xKey.isDown){
            frog.animations.play('openMouth');
        }
    
        //else{
            //plays idle animation if nothing is pressed
            if (tongueAnchored==false){
                frog.animations.play('idle');
            }
        //}
		*/
		if(spaceKey.isDown){
			if(singlePress){
				//top_down.game.camera.x = frog.body.x - 384;
				//top_down.game.camera.y = frog.body.y - 256;
				//console.log("Tongue Out: " + tongueOut + "\nTongue Anchored: " + tongueAnchored + "\nTongue Being Retracted: " + tongueBeingRetracted);
			}
			singlePress = false;
		} else {
			singlePress = true;
			//top_down.game.camera.follow();
		}
}
var frogCurrentlyHittingWall = 0;
function frogHitWall(){
	//console.log("HITTING WALL");
	frogCurrentlyHittingWall++;
	wallSound();
}

function getDataLayerFromTilemap(tilemapName, layerName){
	var length = top_down.game.cache.getTilemapData(tilemapName).data.layers.length;
	for(var i = 0; i < length; i++){
		var name = top_down.game.cache.getTilemapData(tilemapName).data.layers[i].name;
		if(name === layerName){
			return top_down.game.cache.getTilemapData(tilemapName).data.layers[i];
		}
	}
}

function initGame(){
	top_down.game.physics.startSystem(Phaser.Physics.P2JS); //start physics system
	top_down.game.physics.p2.setImpactEvents(true);
	top_down.game.physics.p2.gravity.y = 1400; //set up world gravity
	
	//set up collision groups
	frogCG = top_down.game.physics.p2.createCollisionGroup();
	blockedCG = top_down.game.physics.p2.createCollisionGroup();
	markerCG = top_down.game.physics.p2.createCollisionGroup();
	rockCG = top_down.game.physics.p2.createCollisionGroup();
    flyCG = top_down.game.physics.p2.createCollisionGroup();
    castleCG = top_down.game.physics.p2.createCollisionGroup();
	
	initControls(); //tell Phaser to look for key presses
		
	top_down.game.input.onDown.add(screenClicked, top_down.game); //listen for the screen to be be clicked
	
	gamePreviouslyInit = true;
}

function createGame(level){
	killAll();
	//var currenLevel;
	gameState = "gameStart";
	currentLevel = level;
	if(typeof level == "number"){
		currentLevel = level;
	} else {
		currentLevel = parseInt(level.key.substr(3,4));
	}
	
	if(!gamePreviouslyInit){
			initGame();
	}
	

	
	//set up tilemap and layers
	backgroundImage = top_down.game.add.sprite(0, 0, 'levelBackground1');
	top_down.game.map = top_down.game.add.tilemap('level_' + currentLevel);
	top_down.game.map.addTilesetImage('spritesheet2','tiles2');
	top_down.game.backgroundLayer = top_down.game.map.createLayer('background_nc');
	top_down.game.blockedLayer = top_down.game.map.createLayer('twig_c');
	top_down.game.map.setCollisionBetween(0, 1000, true, 'twig_c');
    
    
    //creates firegroup game
	fireGroup=top_down.game.add.group();

    
	initRocks(getDataLayerFromTilemap("level_" + currentLevel, 'rock_ci')); //spawn rock objects
	
	//console.log(top_down.game.map);
	
    //Fire animations
	// fire = top_down.game.add.sprite("fire");
    //fire.animations.add("default",[0,1,2,3,4], 20, true);

	//make all tiles in the blocked layer impassable

	
	//blockedCG.clearCollision();	
	
	
	blockedLayerTiles = top_down.game.physics.p2.convertTilemap(top_down.game.map, top_down.game.blockedLayer);
	//console.log(blockedLayerTiles);
	for(var i = 0; i < blockedLayerTiles.length; i++){
		blockedLayerTiles[i].setCollisionGroup(blockedCG);
		blockedLayerTiles[i].collides([frogCG]);
		blockedLayerTiles[i].collides([markerCG]);
        blockedLayerTiles[i].collides([flyCG]);
        blockedLayerTiles[i].collides([castleCG]);
	}
	
	//set up frog and frog physics
	if(frogSpawnX < 0 | frogSpawnY < 0){
		alert("Frog not found");
		frogSpawnX = 100;
		frogSpawnY = 100;
	}
	
	addTrigger(); // trigger system has to be rendered before frog
	frog = top_down.game.add.sprite(frogSpawnX, frogSpawnY, 'frog'); //add frog to game
	top_down.game.physics.p2.enable(frog); //give the frog physics
	frog.enableBody = true;
	frog.body.mass = 4;
	frog.body.setCollisionGroup(frogCG);
	frog.body.collides([blockedCG], frogHitWall);
    //frog.anchor.setTo(.39, .60);
	frog.anchor.setTo(.5, .5);
    //frog.body.fixedRotation = true;
	//adding frog animations
    frog.animations.add('idle', [0,0,0,0,0,0,1,1,1,1], 5, true);
    frog.animations.add('openMouthRight', [2], 1, true);
    frog.animations.add('openMouthLeft',[4],1, true);
    frog.animations.add('die',[6,7,8,9,10,11,12,13,14,15,16],5, false);
    
    
	
	tongueArray = [];
    tongueArray.push(new Phaser.Point(0, 0));
	tongueArray.push(new Phaser.Point(0, 0));
	
	tongue = top_down.game.add.rope(frog.x, frog.y, 'tongue', null, tongueArray);
	tongue.updateAnimation = function(){
		updateTonguePoints();
	};



	//fly1 = spawnFlies(fly1,[300,2000]);
    //fly2 = spawnFlies(fly2,[300,2100]);
	
	tongueBeingRetracted = false;
	tongueOut = false;
	
	markerGroup = top_down.game.add.group(); //sets up a group for our tongue markers
	top_down.game.world.bringToTop(frog);
	top_down.game.backgroundLayer.resizeWorld(); //make world the size of background tile map
	
	//Enable this
	top_down.game.camera.follow(frog, Phaser.Camera.FOLLOW_TOPDOWN);

	//var helper = Math.max(top_down.game.width, top_down.game.height) / 4;
	//top_down.game.camera.deadzone = new Phaser.Rectangle((top_down.game.width - helper) / 2, (top_down.game.height - helper) / 2, helper, helper);
	//top_down.game.camera.deadzone = new Phaser.Rectangle(100,100,top_down.game.width-200, top_down.game.height-200);
       
	clearConstraints();
	
	//adjust starting camera position
	top_down.game.camera.x = 0;
	top_down.game.camera.y = 1800;
		
	menuButton = top_down.game.add.sprite(top_down.game.camera.x  + 198, top_down.game.camera.y + 58, 'menu');
	menuButton.inputEnabled = true;
	menuButton.events.onInputDown.add(createPopupMenu, this);
	top_down.game.world.bringToTop(menuButton);
	
	}

function newGame(){
	killAll();
}
var menuClicked = false;
function createPopupMenu(){
	if(menuClicked){
		menuKill();
		return;
	}
	if(!mute)
	selectSound.play();
	homeMenu = top_down.game.add.sprite(top_down.game.camera.x + 512 - (495/2), top_down.game.camera.y + 412 - (377/2), 'popup');
	resumeButton = top_down.game.add.sprite(top_down.game.camera.x + 512 - 68, top_down.game.camera.y + 312 - 29, 'resume');
	restartButton = top_down.game.add.sprite(top_down.game.camera.x + 512 + 10, top_down.game.camera.y + 312 - 29, 'restart');
	volumeButton = top_down.game.add.sprite(top_down.game.camera.x + 512 - 68, top_down.game.camera.y + 312 + 59, 'volumeOn');
	home = top_down.game.add.sprite(top_down.game.camera.x + 512 + 10, top_down.game.camera.y + 312 + 59, 'home');
	resumeButton.inputEnabled = true;
	resumeButton.events.onInputDown.add(menuKill, this);
	homeMenu.inputEnabled = true;
	homeMenu.events.onInputDown.add(goHome, this);
	volumeButton.inputEnabled = true;
	volumeButton.events.onInputDown.add(swapVolume, this);
	restartButton.inputEnabled = true;
	restartButton.events.onInputDown.add(restartLevel, this);
	menuClicked = true;
}

function createHomeScreen(){
	gameState = "homeScreen";
	top_down.game.camera.x = 0;
	top_down.game.camera.y = 0;
	background = top_down.game.add.sprite(-1, -1, 'background');
	homeMenu = top_down.game.add.sprite(512 - (495/2), 412 - (377/2), 'popup');
	playGame = top_down.game.add.sprite(512 - (218/3) - 35, 312 - (35/2) + 91, 'playGame');
	controls = top_down.game.add.sprite(512 - (218/3) - 35, 312 - (35/2) + 91 + 41, 'controls');
	greenVolume = top_down.game.add.sprite(512 - (218/3) - 35, 312 - (35/2) + 91 + 82, 'greenOn');
	greenHelp= top_down.game.add.sprite(512 - (218/3) - 35, 312 - (35/2) + 91 + 123, 'greenHelp');
	logo = top_down.game.add.sprite(512 - (500/6), 262 - (500/2), 'logo');
	logo.scale.setTo(logo.scale.x/2.5, logo.scale.y/2.5);
	playGame.inputEnabled = true;
	controls.inputEnabled = true;
	greenVolume.inputEnabled = true;
	greenHelp.inputEnabled = true;
	playGame.events.onInputDown.add(createLevelStage, this);
	controls.events.onInputDown.add(showControl, this);
	greenVolume.events.onInputDown.add(swapGreenVolume, this);
	greenHelp.events.onInputDown.add(showHelp, this);
}

function goHome(){
	if(resumeButton != null)
	restartLevel();
	resumeButton = null;
	killAll();
	createHomeScreen();
}

function menuKill(){
	if(!mute)
	selectSound.play();
	homeMenu.destroy();
	resumeButton.destroy();
	restartButton.destroy();
	volumeButton.destroy();
	menuClicked = false;
	home.destroy();
}

function killAll(){
	if(top_down.game.map!=null && top_down.game.blockedLayer!=null){
		top_down.game.physics.p2.clearTilemapLayerBodies(top_down.game.map, top_down.game.blockedLayer);
	}
	if(!mute)
		selectSound.play();
	top_down.game.world.removeAll();	
}

var volNum = 0;
function swapVolume(){
	muteSounds();
	volumeButton.destroy();
	if (volNum%2 == 0){
		volumeButton = top_down.game.add.sprite(512 - 67, 312 + 59, 'volumeOff');
	}else{
		volumeButton = top_down.game.add.sprite(512 - 67, 312 + 59, 'volumeOn');
		selectSound.play();
	}
	volNum++;
	volumeButton.inputEnabled = true;
	volumeButton.events.onInputDown.add(swapVolume, this);
}
var greenNum = 0
function swapGreenVolume(){
	muteSounds();
	greenVolume.destroy();
	if (greenNum%2 == 0){
	greenVolume = top_down.game.add.sprite(512 - (218/3) - 35, 312 - (35/2) + 91 + 82, 'greenOff');
	}else{
	greenVolume = top_down.game.add.sprite(512 - (218/3) - 35, 312 - (35/2) + 91 + 82, 'greenOn');
	selectSound.play();
	}
	greenNum++;
	greenVolume.inputEnabled = true;
	greenVolume.events.onInputDown.add(swapGreenVolume, this);
}

function showControl(){
	if(!mute)
	selectSound.play();
	homeMenu.destroy();
	homeMenu = top_down.game.add.sprite(512 - (495/2), 412 - (377/2), 'controlScreen');
	home = top_down.game.add.sprite(512 + 495/32, 312 + 180, 'home');
	home.inputEnabled = true;
	home.events.onInputDown.add(goHome, this);
	
}

function showHelp(){
	homeMenu.destroy();
	homeMenu = top_down.game.add.sprite(512 - (495/2), 412 - (377/2), 'helpScreen');
	home = top_down.game.add.sprite(512 + 495/32, 312 + 180, 'home');
	home.inputEnabled = true;
	home.events.onInputDown.add(goHome, this);
}

function restartLevel(){
	killAll();
	shootMarker(0, 0);
	tongueBeingRetracted = true;
	curRock = null;
	createGame(currentLevel);
}

function createLevelStage(){
	killAll();
	homeMenu = null;
	background = top_down.game.add.sprite(0, 0, 'levelSelect');
	var levelName = "lvl1";
	level = top_down.game.add.sprite(94, 106, levelName);
	level.inputEnabled = true;
	level.events.onInputDown.add(createGame, this);
	for(var i = 0; i < 3; i++){
		levelName = "lvl" + (2 + i);
		level = top_down.game.add.sprite(214*i + 41 + 268, 106 , levelName);
		level.inputEnabled = true;
		level.events.onInputDown.add(createGame, this);
	}
	
	for (var i = 0; i < 4; i++){
		levelName = "lvl" + (5 + i);
		level = top_down.game.add.sprite(214*i + 94, 106 + 146 , levelName);
		level.inputEnabled = true;
		level.events.onInputDown.add(createGame, this);
	}


	for (var i = 0; i < 4; i++){
		levelName = "lvl" + (9 + i);
		level = top_down.game.add.sprite(214*i + 94, 106 + 294 , levelName);
		level.inputEnabled = true;
		level.events.onInputDown.add(createGame, this);
	}
	

	home = top_down.game.add.sprite(20, 20, 'home');
	home.inputEnabled = true;
	home.events.onInputDown.add(goHome, this);
}
var mute;
function muteSounds(){
	if(!mute){
	mute = true;
	music.stop();
	return;
	}
	mute = false;
	music.play('', 0, 1, true, true);
}
function loadSounds(){
	hitWallSound = top_down.game.add.audio('hitwall');
	fireSound = top_down.game.add.audio('fire');
	completeSounds = top_down.game.add.audio('complete');
	selectSound = top_down.game.add.audio('select');
	releaseSound = top_down.game.add.audio('release');
	tongueSound = top_down.game.add.audio('tongueSound');
	music = top_down.game.add.audio('music');
}

function doubleClicked(){
	removeCollisionFromAllRocks();
	console.log("DOUBLE CLICKED!");
		tongueOut = true;
		releaseSound.play();
		shootMarker(frog.x, frog.y);
		tongueBeingRetracted = true;

		//markerGroup.removeAll();
}

function wallSound(){
	if(!mute)
	hitWallSound.play();
}

top_down.Game.prototype = {
	create: function(){
		loadSounds();
		music.play('', 0, 1, true, true);
		createHomeScreen();
		initControls();
	},
	update: function(){
		//checkControls(); //checks if controls have been pressed
        
        checkifLose();
        checkifWin();
		checkControls(); //checks if controls have been pressed

        //Kevin's code
        moveFlies(fly1,1);
        moveFlies(fly2,2);
        
		if (tongueOut == true){
			frog.animations.play("openMouthRight");     
			if(marker != undefined){
				var tempAngle = (Math.atan2(marker.y-(frog.y),marker.x-(frog.x)))*(180/Math.PI);
				//frog.position.rotate(fixedPoint.x, fixedPoint.y, a, true, distancePx);
				//frog.anchor.setTo(1, 1);
				frog.body.angle = tempAngle;                    
			}
			if(frog.x<marker.x && frog.body.velocity.y>0){
				// frog.animations.play("openMouthRight");
				// console.log("frog y velocity",frog.body.velocity.y);
				//console.log("Face: Right");
			}
			if (frog.x>marker.x && frog.body.velocity.y>0){
				//frog.animations.play("openMouthLeft");
				//console.log("Face: Left");
            }
        } else {
			if(tongueBeingRetracted){
				console.log(marker);
				console.log("Tongue Out: " + tongueOut + "\nTongue Anchored: " + tongueAnchored + "\nTongue Being Retracted: " + tongueBeingRetracted);	
				tongueBeingRetracted = false;
				console.log("Something is wrong here");
			}
		}
		if(tongueBeingRetracted && tongueOut){
			//tongueGone();
			//tongueAnchored = false;
			if(moveObjToObj(marker, frog, 1000)){
				//console.log("Marker to frog");
				tongueBeingRetracted = false;
				marker.body.velocity.x = 0;
				marker.body.velocity.y = 0;
				tongueGone();
			}
		}
		
		clearConstraints();
		if(tongueAnchored){
			tongueOut = true;
			if(distanceBetweenFrogAndRock >= 40){
				//don't do if frog is touching any twig	
				distanceBetweenFrogAndRock -= (distanceBetweenFrogAndRock/200) * 4.5;
			
			}
			if(distanceBetweenFrogAndRock <= 160){
				//frog.body.acceleration -= .1;
				if(frog.body.velocity.x > 40){
					frog.body.velocity.x -= 6;
				} else if(frog.body.velocity.x < -40){
					frog.body.velocity.x += 6;
				}
				if(frog.body.velocity.y > 40){
					frog.body.velocity.y -= 6;
				} else if(frog.body.velocity.y < -40){
					frog.body.velocity.y += 6;
				}
			}
			constraints.push(this.game.physics.p2.createDistanceConstraint(frog, wallAnchor, distanceBetweenFrogAndRock));
        }
            else{
                if ((frog!=undefined) && (tongueOut==false)){
                frog.animations.play('idle');            
            }}
		
		if (menuButton != null){
			menuButton.x = top_down.game.camera.x + 768 + 198;
			menuButton.y = top_down.game.camera.y + 512  + 58;
		}
		
		if(resumeButton != null){
			homeMenu.x = top_down.game.camera.x + 512 - (495/2);
			homeMenu.y = top_down.game.camera.y + 312 - (377/2);
			resumeButton.x = top_down.game.camera.x + 512 - 68;
			resumeButton.y = top_down.game.camera.y + 312 - 29;
			restartButton.x = top_down.game.camera.x + 512 + 10;
			restartButton.y = top_down.game.camera.y + 312 - 29;
			volumeButton.x = top_down.game.camera.x + 512 - 68;
			volumeButton.y = top_down.game.camera.y + 312 + 59;
			home.x = top_down.game.camera.x + 512 + 10;
			home.y = top_down.game.camera.y + 312 + 59;
		}
		if(backgroundImage != undefined){
			backgroundImage.x = (top_down.game.camera.x/(top_down.game.backgroundLayer.width * 16/(backgroundImage.width + (top_down.game.camera.width * (backgroundImage.width/top_down.game.camera.width)))));
			backgroundImage.y = (top_down.game.camera.y/(top_down.game.backgroundLayer.height * 16/(backgroundImage.height + (top_down.game.camera.height * (backgroundImage.height/top_down.game.camera.height)))));
		}
		if(gameState == 'gameStart'){
		checkTriggers();
		
		}
	}
}