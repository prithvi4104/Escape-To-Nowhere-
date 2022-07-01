var canvas, backgroundImage;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var playerCount;
var allPlayers;
var distance = 0;
var score = 0;

var player, game;

var runner, police, obstacle1, obstacle2,restart;

var track,track_img, runner_img, obstacle1_img, obstacle2_img, police_img,caught_img,restart_img;

var barrierGroup , coneGroup;

function preload(){
  track_img = loadImage("images/Track.png");
  obstacle1_img = loadImage("images/Barrier.png");
  obstacle2_img = loadImage("images/cone.png");
  police_img = loadImage("images/policeCar.png");
  runner_img = loadAnimation("images/Runner1.png","images/Runner2.png");
  caught_img = loadAnimation("images/Caught.png");
  restart_img = loadImage("images/restart.png");
}

function setup(){
  canvas = createCanvas(displayWidth -20, displayHeight-190);

  track = createSprite(width/2,height/2,width,displayHeight);
  track.addImage("track",track_img);
  track.scale = 4;
  track.velocityY = 4;

  runner = createSprite(width/2,height-315);
  runner.addAnimation("running",runner_img);
  runner.addAnimation("caught",caught_img);

  police = createSprite(runner.x,runner.y + 230);
  police.addImage("Police",police_img);
  police.scale = 0.3;
  police.visible = false;

  restart = createSprite(displayWidth/2,displayHeight/2);
  restart.addImage("restart",restart_img);
  restart.visible = false;
  restart.scale = 0.5;
  
  barrierGroup = new Group();
  coneGroup = new Group();
}


function draw(){

  background(0);
  if(gameState === PLAY){

    score = score + Math.round(getFrameRate()/60);

    track.velocityY = (6 + 3*score/150);

    if(track.y > 310){
  
     track.y = 192;
   }

   //police.debug = true ; 
   
   police.setCollider("rectangle",0,0,police.width-100,800);
  
   if(keyDown("LEFT_ARROW")){
     runner.x = runner.x - 10;
   }
   if(keyDown("RIGHT_ARROW")){
     runner.x = runner.x + 10;
   }
  
   createObstacle();

   police.x = runner.x;

   if(runner.isTouching(coneGroup)){
     for(var index = 0; index < coneGroup.length; index++){
       if(coneGroup[index].isTouching(runner)){
        coneGroup[index].destroy();
        police.visible = true;
       }
     }
     
   }
  
   if(police.isTouching(barrierGroup)){
    for(var index = 0; index < barrierGroup.length; index++){
      if(barrierGroup[index].isTouching(police)){
       barrierGroup[index].destroy();

      }
    }

  }

  if(police.isTouching(coneGroup)){
    for(var index = 0; index < coneGroup.length; index++){
      if(coneGroup[index].isTouching(police)){
         coneGroup[index].destroy();

      }
    }

  }

   if(runner.isTouching(barrierGroup)){
    gameState = END;
    textSize(20);
    text("You Are Caught !",displayWidth/2,displayHeight/2)
    
   }
   
  }
  else if(gameState === END){
    console.log("inside game state end");
    runner.velocityY = 0;
    track.velocityY = 0;
    runner.changeAnimation("caught",caught_img);
    runner.scale = 0.5;
    barrierGroup.setVelocityYEach(0);
    barrierGroup.setLifetimeEach(-1);
    coneGroup.setVelocityYEach(0);
    coneGroup.setLifetimeEach(-1);
    restart.visible = true;
    if(mousePressedOver(restart)){
      reset();
    }
  }
 
  drawSprites();

  textSize(20);
  fill("Black");
  text("Score : "+ score,displayWidth/2 + 200,50); 
}

function createObstacle(){

  if(frameCount % 70 === 0){
    var rand = Math.round(random(1,2));

    if(rand === 1){

      var barrier = createSprite(Math.round(random(380,900)),65);
      barrier.setCollider("rectangle",0,0,barrier.width+70,170);
      barrier.addImage("Barrier",obstacle1_img);
      barrier.scale = 0.5 ;
      barrier.velocityY = 5;
      barrier.lifetime= 115;
      barrierGroup.add(barrier);
    }
    if(rand === 2){
      var cone = createSprite(Math.round(random(380,900)),65);
      cone.addImage("Coen",obstacle2_img);
      cone.scale = 0.2 ;
      cone.velocityY = 5;
      cone.lifetime= 115;
      cone.setCollider("rectangle",0,0,cone.width+5,200);
      coneGroup.add(cone);
    }
  }
  
}

function reset(){

  gameState = PLAY;

  barrierGroup.destroyEach();
  coneGroup.destroyEach();
  restart.visible = false ; 
  runner.changeAnimation("running",runner_img);
  runner.scale = 1;
  score = 0;
  runner.x = width/2;
  runner.y = height-315;
}

