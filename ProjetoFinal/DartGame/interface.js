//https://www.w3schools.com/graphics/tryit.asp?filename=trygame_gravity_game

window.addEventListener("load", function(){

    var canvas = document.getElementById('canv');
    var ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';

    var target = new Image();
    target.src = 'target.png';
    var targetCoord = {
        width0 : canvas.width-100,
        widthF : 85,
        height0 : 100,
        heightF : canvas.height-350 //tamanho de 250 com canvas.height = 600
    }
    var wallCoord = {
        width0 : canvas.width-100,
        widthF : 100,
        height0 : 0,
        heightF : canvas.height,
        color : 'rgb(20, 158, 62)'
    }

    var dart = new Image();
    dart.src = "dardo.png";
    dart.colorP = "#00F0F0";
    
    var turn; //var acumuladora de acréscimo e decréscimo
    var velocity; 
    var time = 0; // tempo para realizar a balística
    var timer; //Alterar sentido
    var frame; //id do animation
    var rotation = (0*Math.PI/180); //alterado!
    var posMoveX = 0; //translação horizontal
    var posInit; //altura relativa do ponto ao canvas
    var y; //altura da ponta do dardo em conjunto com o posInit


    function initAngle() {
        turn = -11;
        timer = 1;
        requestId = undefined;
        window.requestAnimationFrame(drawAngle);
    }

    function initDist() {
        posInit = (Math.sin(rotation)*229)-(Math.cos(rotation)*62)+150;
        timer = 1;
        velocity = 1;
        turn = 1;
        requestId = undefined;
        window.requestAnimationFrame(drawDist);
    }

    function initMove() {
        requestId = undefined;
        window.requestAnimationFrame(drawMove);
    }

    function drawAngle() { 
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

        ctx.save();
        ctx.translate(0, canvas.height-150); 

        if(rotation == (-75*Math.PI/180) || rotation == (-10*Math.PI/180)) timer*=-1;
        if(timer == -1) turn-=1;
        else turn+=1;
        rotation = (turn*Math.PI/180) ;

        ctx.rotate(rotation);
        ctx.translate(105, 0);
        
        ctx.fillStyle = dart.colorP; //define quad color
        ctx.fillRect(124,62,3,3);
        ctx.drawImage(dart,0,0,128,128);

        ctx.restore();

        ctx.beginPath();
        ctx.arc(0, canvas.height-150 ,230, -65*Math.PI/180 , 10*Math.PI/180, false); // outer orbit
        ctx.stroke();
        
        printTargetWall();

        document.body.onkeyup = function(e){
            if(e.keyCode == 32){
                window.cancelAnimationFrame(frame);
                frame = undefined;
                initDist();
            }
        }
        frame = window.requestAnimationFrame(drawAngle);
    }

    function drawDist() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

        ctx.save();
        ctx.translate(0, canvas.height-150);

        if(velocity >= 145 || velocity <= 0) timer*=-1;
        if(timer == -1) turn-=5;
        else turn+=5;
        velocity=turn;

        ctx.rotate(rotation);
        ctx.translate(105, 0);

        ctx.fillStyle = dart.colorP; //define quad color
        ctx.fillRect(124,62,3,3);
        ctx.drawImage(dart,0,0,128,128);

        ctx.restore();

        ctx.fillStyle = "rgb(255,"+(65+velocity)+", 0)"; //define force color
        ctx.fillRect(55,202.5,velocity,20);// 0<tam<145

        ctx.fillStyle = "#000000"; //define force field color
        ctx.fillRect(50,200,155,25);

        printTargetWall();

        document.body.onkeyup = function(e){
            if(e.keyCode == 32){
                window.cancelAnimationFrame(frame);
                frame = undefined;
                console.log(posInit);
                initMove();
            }
        }
        frame = window.requestAnimationFrame(drawDist);
    }

    function drawMove() {

        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

        ctx.save();
        ctx.translate(0, canvas.height-150);

        y = posInit-((velocity*0.1)*time)+(Math.pow(time,2)*0.1);
        rotDart = Math.atan(-0.1*velocity+0.2*time);

        ctx.translate((Math.cos(rotation)*229-Math.sin(rotation)*62)+posMoveX,y);

        //dy/dt => time*0.2 >= velocity*0.05
        //ctx.rotate(rotation+rotDart);
        ctx.rotate(rotDart*0.45);
        //console.log(rotDart);
        //printDart();
        ctx.fillStyle = dart.colorP; //define quad color
        ctx.fillRect(0,-1,3,3);
        ctx.drawImage(dart,-128,-64,128,128);
        //ctx.rotate(-(rotation+rotDart));
        //
        ctx.restore();

        printTargetWall();

        time+=1;
        posMoveX+=velocity*0.05;

        /* ctx.beginPath();
        ctx.moveTo((Math.cos(rotation)*229-Math.sin(rotation)*62)+posMoveX-1, 600);
        ctx.lineTo((Math.cos(rotation)*229-Math.sin(rotation)*62)+posMoveX-1, (600-150)+y);
        ctx.stroke(); */
        //console.log("(600-150)+y : " + (600-150+y));

        if((canvas.height-150)+y > canvas.height || (Math.cos(rotation)*229-Math.sin(rotation)*62)+posMoveX >= canvas.width-100){
            console.log("(600-150)+y : " + (600-150+y));
            console.log('y: ' + y);
            //document.body.onkeyup(32);
            window.cancelAnimationFrame(frame);
            frame = undefined;
            setTimeout(function(){alert("Você ganhou " + eval((600-150)+y) + " ponto(s)");},1000);
        }
        else frame = window.requestAnimationFrame(drawMove);
    }

    function printTargetWall(){
        ctx.drawImage(target, targetCoord.width0, targetCoord.height0, targetCoord.widthF, targetCoord.heightF); //draw target
        ctx.fillStyle = wallCoord.color; //define wall color
        ctx.fillRect(wallCoord.width0, wallCoord.height0, wallCoord.widthF, wallCoord.heightF); //define wall position
    }

    function eval(posY){
        if(posY > 200 && posY < 250) return 5;
        else if(posY > 175 && posY < 275) return 4;
        else if(posY > 150 && posY < 300) return 3;
        else if(posY > 125 && posY < 325) return 2;
        else if(posY > 100 && posY < 350) return 1;
        else if(posY < 0) alert("Penou aí fera?");
        return 0;
    }

    initAngle();
});

(function titleMarquee() {
    document.title = document.title.substring(1)+document.title.substring(0,1);
    setTimeout(titleMarquee, 200);
})();

