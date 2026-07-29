let load = 0;

let loader = setInterval(()=>{

load++;

document.getElementById("progress").style.width = load+"%";


if(load >= 100){

clearInterval(loader);

document.getElementById("loading").style.display="none";

document.getElementById("game").style.display="block";

document.getElementById("ui").style.display="block";

startGame();

}

},30);





// =================
// الصوت بالكود
// =================

let audio;


function makeSound(freq,time){

if(!audio)
audio=new AudioContext();


let osc=audio.createOscillator();

let gain=audio.createGain();


osc.frequency.value=freq;

gain.gain.value=.08;


osc.connect(gain);

gain.connect(audio.destination);


osc.start();

osc.stop(
audio.currentTime+time
);

}





// =================
// بداية اللعبة
// =================


function startGame(){


let canvas=document.getElementById("game");

let ctx=canvas.getContext("2d");


canvas.width=innerWidth;
canvas.height=innerHeight;



let world={

width:3000,

height:3000

};



// اللاعب

let player={

x:1500,

y:1500,

size:40,

speed:5,

inCar:false

};




// السيارة

let car={

x:1700,

y:1500,

w:80,

h:45

};




// الشرطة

let police={

x:500,

y:500,

speed:2

};




// أشخاص

let people=[];


for(let i=0;i<20;i++){

people.push({

x:Math.random()*3000,

y:Math.random()*3000,

alive:true

});

}



let stars=0;


let bullets=[];


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


if(d<100){

player.inCar=!player.inCar;


document.getElementById("carState").innerHTML=

player.inCar?"راكب":"لا يوجد";


if(player.inCar)
makeSound(150,.5);


}


}




// إطلاق النار

if(e.code=="Space"){


bullets.push({

x:player.x,

y:player.y,

dx:10

});


stars++;

document.getElementById("stars").innerHTML=stars;


makeSound(700,.1);



}



});





document.addEventListener(
"keyup",
e=>{

keys[e.key]=false;

});






function update(){



let speed=
player.inCar?10:player.speed;



if(keys["w"])
player.y-=speed;


if(keys["s"])
player.y+=speed;


if(keys["a"])
player.x-=speed;


if(keys["d"])
player.x+=speed;




// السيارة

if(player.inCar){

car.x=player.x;

car.y=player.y;

}





// الرصاص

bullets.forEach(b=>{

b.x+=b.dx;


});





// الشرطة

let dx=
player.x-police.x;


let dy=
player.y-police.y;


let dist=Math.hypot(dx,dy);



if(stars>0 && dist<900){


police.x+=dx/dist*police.speed;

police.y+=dy/dist*police.speed;


makeSound(400,.05);


}




// الناس تهرب

people.forEach(p=>{


let d=Math.hypot(
player.x-p.x,
player.y-p.y
);



if(d<150){


p.x-=1;

p.y-=1;


}


});




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



// الكاميرا

let camX=
player.x-canvas.width/2;


let camY=
player.y-canvas.height/2;




// الأرض

ctx.fillStyle="#4b9b4b";

ctx.fillRect(
-camX,
-camY,
world.width,
world.height
);



// الشوارع

ctx.fillStyle="#444";


for(let i=0;i<3000;i+=300){

ctx.fillRect(
i-camX,
0-camY,
80,
3000
);


ctx.fillRect(
0-camX,
i-camY,
3000,
80
);


}



// السيارة

ctx.fillStyle="red";


ctx.fillRect(

car.x-camX,

car.y-camY,

car.w,

car.h

);




// الناس

ctx.fillStyle="orange";


people.forEach(p=>{

if(p.alive)

ctx.fillRect(

p.x-camX,

p.y-camY,

25,

25

);


});




// اللاعب

if(!player.inCar){

ctx.fillStyle="blue";


ctx.fillRect(

player.x-camX,

player.y-camY,

player.size,

player.size

);


}





// الشرطة

ctx.fillStyle="black";


ctx.fillRect(

police.x-camX,

police.y-camY,

45,

45

);



ctx.font="25px Arial";

ctx.fillText(

"👮",

police.x-camX,

police.y-camY

);




// الرصاص

ctx.fillStyle="yellow";


bullets.forEach(b=>{

ctx.fillRect(

b.x-camX,

b.y-camY,

10,

5

);


});



}



update();


}
