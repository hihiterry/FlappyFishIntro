const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 400;
const CANVAS_HEIGHT = canvas.height = 600;
const GRAVITY = 0.1;
const MOVESPEED = 2;
const GAP = 300;
let gameState_num = 0;//遊戲狀態:0未開始,1運行中,2死亡
let distance_num = 0 ,score_num = 0;

//玩家類別
class Player {
    constructor() {
        this.image = new Image();
        this.image.src = "images/fish.png";
        this.width_num = 74;
        this.height_num = 45;
        this.x_num = 100;
        this.y_num = (CANVAS_HEIGHT - this.height_num) / 2;
        this.velocity_num = 0;
        this.acceleration_num = 0;
    }

    reinitialize(){
        this.width_num = 74;
        this.height_num = 45;
        this.x_num = 100;
        this.y_num = (CANVAS_HEIGHT - this.height_num) / 2;
        this.velocity_num = 0;
        this.acceleration_num = 0;
    }

    update() {
        if (this.acceleration_num < 0) {
            this.acceleration_num += 0.05;
        }
        this.velocity_num += this.acceleration_num + GRAVITY;
        if(this.velocity_num > 10){
            this.velocity_num = 10;
        }
        this.y_num += this.velocity_num;
    }

    draw() {
        ctx.drawImage(this.image, this.x_num, this.y_num, this.width_num, this.height_num);
    }
}

//水管的類別
class pipe{
    constructor(imageSource,startXPosition_num,startYPosition_num){
        this.x_num = startXPosition_num;
        this.y_num = startYPosition_num;
        this.width_num = 100;
        this.height_num = 300;
        this.image = new Image();
        this.image.src = imageSource;
    }

    reinitialize(startXPosition_num,startYPosition_num){
        this.x_num = startXPosition_num;
        this.y_num = startYPosition_num;
    }

    update(){
        this.x_num -= MOVESPEED;
    }

    draw() {
        ctx.drawImage(this.image, this.x_num, this.y_num, this.width_num, this.height_num);
    }
}

let pipes = [new pipe("images/upperPipe.png",600,-400),new pipe("images/lowerPipe.png",600,-400)];
let player = new Player();

const sky = new Image();
sky.src = "images/background.png";
let skyX = 0;

const floor = new Image();
floor.src = "images/floor.png";
let floorX = 0;

//開始時執行一次
setInterval(reflesh, 8);
reinitialize();

//重新初始化
function reinitialize() {
    skyX = 0;
    floorX = 0;
    distance_num = 0;
    score_num = 0;
    player.reinitialize();
    pipes[0].reinitialize(500, Math.random() * 230 + 30 - pipes[0].height_num);
    pipes[1].reinitialize(500, pipes[0].y_num + pipes[0].height_num + GAP);
}

//死亡設定
function checkAndSetGameover(){
    //檢測碰撞
    for(let i_num=0;i_num<pipes.length;i_num++){
        if(isCollide(player, pipes[i_num])){
            gameState_num=2;
            return;
        }
    }
    //檢測是否碰到邊界
    if (player.y_num < 0) {
        gameState_num=2;
    }
    if(player.y_num > CANVAS_HEIGHT - player.height_num){
        gameState_num=2;
    }
}

//碰撞判定
function isCollide(player, pipe) {
    return !(
        ((player.y_num + player.height_num) < (pipe.y_num)) ||
        (player.y_num > (pipe.y_num + pipe.height_num)) ||
        ((player.x_num + player.width_num) < pipe.x_num) ||
        (player.x_num > (pipe.x_num + pipe.width_num))
    );
}

//刷新遊戲
function reflesh(){
    if(gameState_num === 1){
        update();
        checkAndSetGameover();
    }
    draw();
}

//更新狀態
function update() {
    player.update();
    for(let i_num = 0;i_num<pipes.length;i_num++){
        pipes[i_num].update();
        if(pipes[0].x_num + pipes[0].width_num<0){
            pipes[0].reinitialize(pipes[0].x_num+500, Math.random() * 230 + 30 - pipes[0].height_num);
            pipes[1].reinitialize(pipes[0].x_num, pipes[0].y_num + pipes[0].height_num + GAP);
        }
    }
    skyX -= MOVESPEED*0.7;
    if(skyX<=-1200){
        skyX=0;
    }
    floorX -= MOVESPEED;
    if(floorX<=-1200){
        floorX=0;
    }
    distance_num+=MOVESPEED;
    if(distance_num>= 500){
        distance_num = 0;
        score_num++;
    }
}

//繪製遊戲畫面
function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(sky,skyX,0);
    ctx.drawImage(floor,floorX,580);
    for(let i_num = 0;i_num<pipes.length;i_num++){
        pipes[i_num].draw();
    }
    player.draw();
    drawText();
}

//繪製文字
function drawText() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "White";
    ctx.textAlign = "center";
    switch (gameState_num) {
        case 0:
            ctx.fillText("Press any key to Start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            break;
        case 1:
            ctx.font = "60px Arial";
            ctx.fillText(`${score_num}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);
            break;
        case 2:
            ctx.fillText("Game Over", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            ctx.fillText("Press any key to Restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
            break;
        default:
            break;
    }
}

//感側按鍵
document.addEventListener("keydown", (event) => {
    event.preventDefault();
    if(gameState_num===1){
        player.acceleration_num = -0.85;
        player.velocity_num = 0;
    }else{
        if(gameState_num===0){
            gameState_num=1;
        }
        if(gameState_num===2){
            gameState_num=0;
            reinitialize();
        }
    }
});

//手機遊玩
document.addEventListener("touchstart", handleTouchStart, false);
function handleTouchStart(event) {
    event.preventDefault();
    if(gameState_num===1){
        player.acceleration_num = -0.85;
        player.velocity_num = 0;
    }else{
        if(gameState_num===0){
            gameState_num=1;
        }
        if(gameState_num===2){
            gameState_num=0;
            reinitialize();
        }
    }
}