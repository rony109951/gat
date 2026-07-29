let load = 0;

let loading = setInterval(()=>{

load++;

document.getElementById("bar").style.width = load+"%";

if(load >= 100){

clearInterval(loading);

document.getElementById("loading").style.display="none";

document.getElementById("game").style.display="block";

document.getElementById("info").style.display="block";

startGame();

}

},30);




// =========================
// نظام الصوت بالكود
// =========================

let audioCtx;


function initAudio(){

if(!audioCtx){

audioCtx =
new(window.AudioContext ||
window.webkitAudioContext)();

}

}



function sound(type){

initAudio();


let osc =
audioCtx.createOscillator();

let gain =
audioCtx.createGain();



osc.connect(gain);

gain.connect(audioCtx.destination);



if(type=="car"){

osc.frequency.value=120;

gain.gain.value=.08;

}


if(type=="shoot"){

osc.frequency.value=800;

gain.gain.value=.2;

}


if(type=="scream"){

osc.frequency.value=300;

gain.gain.value=.15;

}


if(type=="police"){

osc.frequency.value=600;

gain.gain.value=.05;

}


osc.start();

osc.stop(
audioCtx.currentTime+.2
);


}



// =========================
// اللعبة
// =========================


function startGame(){


let canvas =
document.getElementById("game");

let ctx =
canvas.getContext("2d");


canvas.width=innerWidth;
canvas.height=innerHeight;




let player={

x:500,

y:400,

size:35,

speed:5,

health:100,

inCar:false

};



let car={

x:700,

y:400,

w:70,

h:40

};



let police={

x:100,

y:100,

speed:2

};



let npc={

x:900,

y:300,

speed:1,

alive:true

};



let bullets=[];


let stars=0;



let keys={};



document.addEventListener(
"keydown",
e=>{


keys[e.key]=true;



// ركوب السيارة

if(e.key=="e"){


let d=Math.hypot(
player.x-car.x,
player.y-car.y
);



if(d<90){

player.inCar=
!player.inCar;


if(player.inCar){

sound("car");

}

}


}



// إطلاق النار

if(e.code=="Space"){


bullets.push({

x:player.x,

y:player.y,

speed:10

});


sound("shoot");


stars++;


if(npc.alive){

npc.alive=false;

sound("scream");

}



}


});





document.addEventListener(
"keyup",
e=>{

keys[e.key]=false;

});





function update(){



let speed =
player.inCar ? 10 : player.speed;



if(keys["w"])
player.y-=speed;


if(keys["s"])
player.y+=speed;


if(keys["a"])
player.x-=speed;


if(keys["d"])
player.x+=speed;




// السيارة تتبع اللاعب

if(player.inCar){

car.x=player.x;

car.y=player.y;

}




// الرصاص

bullets.forEach(b=>{

b.x+=b.speed;


});




// NPC يهرب

if(npc.alive){


let d=
Math.hypot(
player.x-npc.x,
player.y-npc.y
);


if(d<200){


npc.x-=1;

npc.y-=1;


}

}




// الشرطة


let dx=
player.x-police.x;


let dy=
player.y-police.y;


let dis=
Math.sqrt(
dx*dx+dy*dy
);



if(stars>0 && dis<600){


police.speed=
2+stars;


police.x+=
dx/dis*
police.speed;


police.y+=
dy/dis*
police.speed;



sound("police");


}





draw();


requestAnimationFrame(update);

}





function draw(){



ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



// الأرض

ctx.fillStyle="#4b934b";

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);



// الطريق

ctx.fillStyle="#555";

ctx.fillRect(
0,
350,
canvas.width,
150
);



// السيارة

ctx.fillStyle="red";

ctx.fillRect(
car.x,
car.y,
car.w,
car.h
);



// اللاعب

if(!player.inCar){

ctx.fillStyle="blue";

ctx.fillRect(
player.x,
player.y,
player.size,
player.size
);

}




// NPC

if(npc.alive){

ctx.fillStyle="orange";

ctx.fillRect(
npc.x,
npc.y,
30,
30
);

}




// الشرطة

ctx.fillStyle="black";

ctx.fillRect(
police.x,
police.y,
45,
45
);



ctx.font="25px Arial";

ctx.fillStyle="white";


ctx.fillText(
"👮",
police.x,
police.y
);




// الرصاص

ctx.fillStyle="yellow";

bullets.forEach(b=>{

ctx.fillRect(
b.x,
b.y,
10,
5
);

});



// النجوم

ctx.font="30px Arial";

ctx.fillText(
"⭐".repeat(stars),
20,
40
);



}


update();



}