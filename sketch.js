var monkey, monkeyAnimation;

var cityImage, city;

var invisibleGround;

var obstaclesGroup, obstacles, redCar, blueCar, yellowCar;

var fruitsGroup, fruits, banana, berry;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var helicopters, hilicopterImg, helicopterGroup;

var sadMonkeyImg;

var gameOverImg, gameOver;

var score;

var lifetime;

var jumpSound, deadSound, checkpoint, crashSound;

function preload(){
  
  monkeyAnimation = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png  ","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");

  cityImage = loadImage("city.png");
  
  blueCar  = loadImage("blue car.png");
  redCar = loadImage("red car.png");
  yellowCar = loadImage("yellow car.png");
  
  banana = loadImage("banana.png");
  berry = loadImage("blueberries.png");

  helicopterImg = loadImage("helicopter.png");
  
  sadMonkeyImg = loadImage("sad monkey.png");
  
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("cartoon_hop_jump_bounce.mp3");
  
  deadSound = loadSound("esm_8_bit_game_over_1_arcade_80s_simple_alert_notification_game.mp3");
  
  checkpoint = loadSound("noisecreations_SFX-NCFREE02_Flabby-Burd.mp3");
  
  crashSound = loadSound("zapsplat_impacts_car_crash_smash_head_on_23549.mp3");
  
}

function setup() {
  
  createCanvas(600, 600);
  
  city = createSprite(300,350,20,20);
  city.addImage("background",cityImage);
  city.x = city.width /2;
  
    
  monkey = createSprite(100,450,20,20);
  monkey.addAnimation("running", monkeyAnimation);
  monkey.addAnimation("dead",sadMonkeyImg);
  monkey.scale = 0.2;
  
  invisibleGround = createSprite(300,500,7000,20);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100,20,20);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.scale = 0.5;
  
  obstaclesGroup = createGroup();
  fruitsGroup = createGroup();
  helicopterGroup = createGroup();
  
  //monkey.debug = true;
  monkey.setCollider("circle",0,0,100);
  
  score = 0
  
  lifetime = 3;
} 


function draw() {
  
  background("lightblue");
  
  if(gameState === PLAY){
    
    gameOver.visible = false;
    
    //city.velocityX = -6 - score/2;
    
    /*if(city.x < 0){
  city.x = city.width /2;    
  }*/
  
  if(keyDown("space") && monkey.y > 250){
    monkey.velocityY = -12
    jumpSound.play();
  }

  if(keyDown("RIGHT_ARROW")){
    monkey.x = monkey.x + 5;
  }
  
  monkey.velocityY = monkey.velocityY + 0.5;
    
    
  if(monkey.isTouching(fruitsGroup)){
    score = score + 2;
    fruitsGroup.destroyEach();
  }
    
  spawnObstacles();
  spawnFruits();
  spawnHelicopters();
    
    if(obstaclesGroup.isTouching(monkey) ||            helicopterGroup.isTouching(monkey)){
      lifetime = lifetime - 1;
      
      crashSound.play();
      
  obstaclesGroup.destroyEach();
  helicopterGroup.destroyEach();
    }
    
    if(score % 30 === 0 && score > 0){
      checkpoint.play();
    }
    
    if(lifetime === 0){
      gameState = END;
      deadSound.play();
    }
    
  } 
 else if(gameState === END){
    
    gameOver.visible = true;    
    
    city.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    fruitsGroup.setVelocityXEach(0);
    helicopterGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    fruitsGroup.setLifetimeEach(-1);
    helicopterGroup.setLifetimeEach(-1);
    
    monkey.velocityY = 0;
    
    monkey.changeAnimation("dead",sadMonkeyImg);
    monkey.scale = 2;
    monkey.x = 300;
    monkey.y = 450;
    
    obstacles.visible = false;
    fruits.visible = false;
    helicopters.visible = false;
    
    if(mousePressedOver(monkey)){
      reset();
    }
  }
  
  monkey.collide(invisibleGround);

  camera.position.x = monkey.x
  camera.position.y = 300;
  
  drawSprites();
  
  text("score = " + score,500,50);
  
  text("lives = " + lifetime,100,50);
  
  if(gameState === END){
    text("you ran out of lives,click on the monkey to restart",180,200);
  }
}

function reset(){
  gameState = PLAY;
  
  obstaclesGroup.destroyEach();
  fruitsGroup.destroyEach();
  helicopterGroup.destroyEach();
  
  monkey.changeAnimation("running", monkeyAnimation);
  
  score = 0;
  
  monkey.scale = 0.2;
  monkey.x = 100;
  monkey.y = 450;
  
  city.velocityX = -6;
  
  lifetime = 3;
  
}

function spawnObstacles(){
  
  if(frameCount % 90 === 0){
  obstacles = createSprite(6000,Math.round(random(400,300)),20,20);
  obstacles.velocityX = -12 - score/2;
    
    var rand = Math.round(random(1,3));
    
    switch(rand){
      case 1: obstacles.addImage("blue",blueCar);
              obstacles.scale = 0.04;
              obstacles.y = 500;
      break;
      case 2: obstacles.addImage("red",redCar);
              obstacles.scale = 0.4;
              obstacles.y = 480;
      break;
      case 3: obstacles.addImage("yellow", yellowCar);
              obstacles.scale = 0.3;
              obstacles.y = 500;
      break;
      default:
      break;
      
    }
          
      obstacles.lifetime = 6000;
    
      obstaclesGroup.add(obstacles);
  }
}

function spawnFruits(){
  
  if(frameCount % 100 === 0){
    fruits = createSprite(6000,300,20,20);
    fruits.velocityX = -12 - score/2;
    
    var rand = Math.round(random(1,2));
    
    switch(rand){
      case 1: fruits.addImage("banana",banana);
              fruits.scale = 0.2
        break;
      case 2: fruits.addImage("blueberries",berry);
              fruits.scale = 0.4;
        break;
      default:
        break;
    }
    
    fruits.lifetime = 6000;
    
    fruitsGroup.add(fruits);
  }
}

function spawnHelicopters(){
  
  if(frameCount % 200 === 0){
    helicopters = createSprite(6000,100,20,20);
    helicopters.addImage("police",helicopterImg);
    helicopters.velocityX = -12 - score/2;
    helicopters.scale = 0.2;
    
    helicopters.lifetime = 6000;
    
    helicopterGroup.add(helicopters);
  }

}
