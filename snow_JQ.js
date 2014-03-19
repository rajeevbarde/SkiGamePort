$(document).ready(function () {

    var canvas = $("#gameCanvas");
    var context = canvas.get(0).getContext("2d");

    var jkk = 0;
    // Canvas dimensions
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();

    //int
    var x = 250;  //Starting horizontal position of snowboarder
    var armWave = 0;  //Tracks arm wave of snowboarder when going straight down.
    var jumpedCounter = 0;  //files for jumps.
    var pausedCounter = 0;  //Counter for animating paused display.
    var score = 0;  //Variables for tracking score, high score, and distance.
    var highScore = 0;
    var distance = 0;
    var crashedCounter = 0, crashedCounter2 = 0;

    //images
    var start = new Image();  //Image for startup screen.
    var exit = new Image();  //Image for exit game screen.
    var end = new Image();  //Image for end game screen.
    var mySkier = new Image();  //Image for snowboarder.
    var ow = new Image();
    var paused = new Array(6);  //Images for animated paused display.
    var offImage;  //Image and Graphics for drawing off screen and then copying it

    //String
    var tempDirection = "";  //Stores direction when paused.
    var direction = "start1";  //Shows startup screen on load.

    //AudioClip
    var crashed1, crashed2, crashed3;
    var jump;

    //Boolean
    var jumped = false, jumpedSlow = false; //Variables, images, and audio
    var crashed = false;  //Variables, images, and audio files for crashes.
    var muted = false;


    var myMoguls = new Array(5); //Array of mogul objects.
    var mySkiers = new Array(4);  //Array of skier objects.
    var myRocks = new Array(10);  //Array of rock objects.
    var myTrees = new Array(20);  //Array of tree objects.
    var mySantas = new Array(3);  //Array of santa objects.

    //intialize Object values
    var numMoguls = 5;  //Number of moguls generated.
    var numRocks = 10;  //Number of rocks generated.
    var numTrees = 20;  //Number of trees generated.
    var numSantas = 3;  //Number of santas generated.
    var numSkiers = 4;  //Number of skiers generated.

    //Some graphics data type
    var offGraphics;  //onto the main screen to prevent white flashing.

    //Tread
    var t; //thread



    init();

    /*****************************
    init()
    ******************************/

    function init() {

        for (var i = 0; i < numMoguls; i++)  //Generates initial mogul locations.
        {
            myMoguls[i] = new Moguls();
            myMoguls[i].newMogul(Math.random());

        }

        for (var i = 0; i < numRocks; i++)  //Generates initial rock locations.
        {
            myRocks[i] = new Rocks();
            myRocks[i].newRock(Math.random());
        }

        for (var i = 0; i < numTrees; i++)  //Generates initial tree locations.
        {
            myTrees[i] = new Trees();
            myTrees[i].newTree(Math.random());
        }


        for (var i = 0; i < numSantas; i++)  //Generates initial Santa locations.
        {
            mySantas[i] = new Santas();
            mySantas[i].newSanta(Math.random());
        }
        for (var i = 0; i < numSkiers; i++)  //Generates initial skier locations.
        {
            mySkiers[i] = new Skiers();
            mySkiers[i].newSkier(Math.random());
        }

        for (var i = 0; i < 6; i++)  //Sticks the proper images into the 
        {                             //array of paused images.
            paused[i] = new Image();
            paused[i].src = "images/paused" + (i + 1) + ".gif";
        }

        ow.src = "images/snowboardouch.gif";
        crashed1 = document.createElement('audio'); crashed1.setAttribute('src', 'audio/splat.wav');
        crashed2 = document.createElement('audio'); crashed2.setAttribute('src', 'audio/hithard.wav');
        crashed3 = document.createElement('audio'); crashed3.setAttribute('src', 'audio/dullthump.wav');
        jump = document.createElement('audio'); jump.setAttribute('src', 'audio/boing2.wav');


        newGame();

    } //init()


    /*****************************
    newGame()
    ******************************/

    function newGame() {
        x = 250;  //Resets the snowboarder.
        crashed = false;  //Clears crashed and jumped states.
        crashedCounter = 0;
        crashedCounter2 = 0;
        jumped = false;
        jumpedSlow = false;
        jumpedCounter = 0;
        distance = 0;  //Resets distance and score.
        score = 0;

        direction = "stop";  //Sets snowboarder to the stopped direction.



        for (var i = 0; i < numMoguls; i++)  //Generates new mogul locations.
            myMoguls[i].newMogul(Math.random());
        for (var i = 0; i < numRocks; i++)  //Generates new rock locations.
            myRocks[i].newRock(Math.random());
        for (var i = 0; i < numTrees; i++)  //Generates new tree locations.
            myTrees[i].newTree(Math.random());
        for (var i = 0; i < numSantas; i++)  //Generates new Santa locations.
            mySantas[i].newSanta(Math.random());
        for (var i = 0; i < numSkiers; i++)  //Generates new skier locations.
            mySkiers[i].newSkier(Math.random());

        animate();
        /*****************************
        Keydown()
        ******************************/

        $(window).keydown(function (e) {
            var keyCode = e.keyCode; //Stores keys that are pressed.

            var NUMPAD_0 = 96;
            var NUMPAD_1 = 97;
            var NUMPAD_2 = 98;
            var NUMPAD_3 = 99;
            var NUMPAD_4 = 100;
            var NUMPAD_5 = 101;
            var NUMPAD_6 = 102;
            var NUMPAD_7 = 103;
            var NUMPAD_8 = 104;
            var NUMPAD_9 = 105;
            var NUMPAD_DECIMAL = 110;

            if (direction == "start1") {//Allows keys from the start screen.
                if (keyCode == NUMPAD_8)
                    direction = "stop";
                if (keyCode == NUMPAD_6)
                    direction = "start2";
            }
            else if (direction == "start2") {//Allows keys from the second start screen.
                if (keyCode == NUMPAD_8)
                    direction = "stop";
                if (keyCode == NUMPAD_4)
                    direction = "start1";
                if (keyCode == NUMPAD_6)
                    direction = "start3";
            }
            else if (direction == "start3") {//Allows keys from the third start screen.
                if (keyCode == NUMPAD_8)
                    direction = "stop";
                if (keyCode == NUMPAD_4)
                    direction = "start2";
            }
            else if (direction == "exit") {//Allows only 8 to be pressed after exiting a game.
                if (keyCode == NUMPAD_8) {
                    newGame();
                }
            }
            else if (direction == "end") {//Allows only 8 to be pressed after the game ends.
                if (keyCode == NUMPAD_8) {
                    newGame();
                }
            }
            else if (direction == "paused") {//Allows only 5 to be pressed when paused.
                if (keyCode == NUMPAD_0)
                    direction = "exit";
                if (keyCode == NUMPAD_5) {//Sets direction to the value it held prior to being paused.
                    direction = tempDirection;
                    if (direction == "upleft" || direction == "upright")
                        direction = "stop"; //Sets direction to stop if 7 or 9 were held down when paused.
                }
            }
            else if (jumped == true) {//Allows only some keys when jumped is set to true.
                if (keyCode == NUMPAD_0)
                    direction = "exit";
                if (keyCode == NUMPAD_1)
                    direction = "downleft";
                if (keyCode == NUMPAD_3)
                    direction = "downright";
                if (keyCode == NUMPAD_2)
                    direction = "down";
                if (keyCode == NUMPAD_4)
                    direction = "downleft";
                if (keyCode == NUMPAD_6)
                    direction = "downright";
                if (keyCode == NUMPAD_5) { //Stores direction so it can be restored when the game is unpaused.
                    tempDirection = direction;
                    direction = "paused";
                }
            }
            else if (jumpedSlow == true) {//Allows only some keys when jumpedSlow is true.
                if (keyCode == NUMPAD_0)
                    direction = "exit";
                if (keyCode == NUMPAD_4)
                    direction = "left";
                if (keyCode == NUMPAD_6)
                    direction = "right";
                if (keyCode == NUMPAD_1)
                    direction = "left";
                if (keyCode == NUMPAD_3)
                    direction = "right";
                if (keyCode == NUMPAD_2)
                    direction = "slowdown";
                if (keyCode == NUMPAD_5) {//Stores direction so it can be restored when the game is unpaused.
                    tempDirection = direction;
                    direction = "paused";
                }
            }
            else if (crashed == true) { } //Disables all commands when crashed is true (approx. .5 seconds).
            else if (direction == "crashed") {//Allows only some keys to be pressed after crashed is set to false but while direction still equals crashed.
                if (keyCode == NUMPAD_0)
                    direction = "exit";
                if (keyCode == NUMPAD_4)
                    direction = "left";
                if (keyCode == NUMPAD_6)
                    direction = "right";
                if (keyCode == NUMPAD_1)
                    direction = "downleft";
                if (keyCode == NUMPAD_3)
                    direction = "downright";
                if (keyCode == NUMPAD_2)
                    direction = "down";
                if (keyCode == NUMPAD_5) { //Stores direction so it can be restored when the game is unpaused.
                    tempDirection = direction;
                    direction = "paused";
                }
            }
            else {//Keys allowed when not crashed, jumped, paused, or on the start screens.
                if (keyCode == NUMPAD_0)
                    direction = "exit";
                if (keyCode == NUMPAD_4)
                    direction = "left";
                if (keyCode == NUMPAD_6)
                    direction = "right";
                if (keyCode == NUMPAD_1)
                    direction = "downleft";
                if (keyCode == NUMPAD_3)
                    direction = "downright";
                if (keyCode == NUMPAD_7)
                    direction = "upleft";
                if (keyCode == NUMPAD_9)
                    direction = "upright";
                if (keyCode == NUMPAD_2)
                    direction = "down";
                if (keyCode == NUMPAD_8)
                    direction = "stop";
                if (keyCode == NUMPAD_5) {//Stores direction so it can be restored when the game is unpaused.
                    tempDirection = direction;
                    direction = "paused";
                }
            }

            if (keyCode == NUMPAD_DECIMAL)  //Mutes sound.
                muted = !muted;



        }); //Keydown events

        /*****************************
        Keyup()
        ******************************/

        $(window).keyup(function (e) {
            var keyCode = e.keyCode;
            var NUMPAD_7 = 103;
            var NUMPAD_9 = 105;

            if (!(direction == "start1" || direction == "start2" || direction == "start3" || direction == "paused" || jumped == true || jumpedSlow == true || direction == "crashed" || direction == "exit" || direction == "end")) {
                if (keyCode == NUMPAD_7)
                    direction = "upleft";
                if (keyCode == NUMPAD_9)
                    direction = "upright";
            }

        }); //keyup


    } //newGame()

    /*****************************
    Animate()
    ******************************/

    function animate() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        moveSkier(); //run() in java
        // context.fillRect(0, 0, 500, 500); //update()
        //all paintframe() below
        


        if (direction == "start1") {
            start.src = "images/start1.gif";
            context.drawImage(start, 0, 0);
        }
        else if (direction == "start2") {
            start.src = "images/start2.gif";
            context.drawImage(start, 0, 0);
        }
        else if (direction == "start3") {
            start.src = "images/start3.gif";
            context.drawImage(start, 0, 0);
        }
        else if (direction == "exit") {
            exit.src = "images/exit.gif";
            context.drawImage(exit, 0, 0);
            context.fillText("Your Score", 185, 315);
            context.fillText("=  " + score, 253, 315);
            context.fillText("High Score", 185, 335);
            context.fillText("= " + highScore, 253, 335);
        }
        else if (direction == "end") {
            end.src = "images/end.gif";
            context.drawImage(end, 0, 0);
            context.fillText("Your Score", 185, 315);
            context.fillText("=  " + score, 253, 315);
            context.fillText("High Score", 185, 335);
            context.fillText("= " + highScore, 253, 335);
        }
        else {

            if (jumped == true || jumpedSlow == true)
                mySkier.src = "images/snowboardjump.gif";
            else {
                if (direction == "crashed")
                    mySkier.src = "images/snowboardcrash1.gif";
                if (direction == "stop" || direction == "upleft" || direction == "upright")
                    mySkier.src = "images/snowboardside.gif";
                if (direction == "left")
                    mySkier.src = "images/snowboard45.gif";
                if (direction == "right")
                    mySkier.src = "images/snowboard135.gif";
                if (direction == "downleft")
                    mySkier.src = "images/snowboard60.gif";
                if (direction == "downright")
                    mySkier.src = "images/snowboard120.gif";
                if (direction == "down")
                    if (armWave < 8)
                        mySkier.src = "images/snowboard0a.gif";
                    else {
                        mySkier.src = "images/snowboard0b.gif";
                        if (armWave >= 16)
                            armWave = 0;
                    }
            } //nearest-else
            for (var i = 0; i < numMoguls; i++)  //Draws moguls
            {
                myMoguls[i].mogulImage.src = "images/snowboardmogul.gif";
                context.drawImage(myMoguls[i].mogulImage, myMoguls[i].x, myMoguls[i].y);

            }
            for (var i = 0; i < numRocks; i++)  //Draws Rocks
            {
                myRocks[i].rockImage.src = "images/snowboardrock.gif";
                context.drawImage(myRocks[i].rockImage, myRocks[i].x, myRocks[i].y);

            }

            for (var i = 0; i < numTrees; i++)  //Draws trees.
            {
                myTrees[i].treeImage.src = "images/snowboardtree.gif";
                context.drawImage(myTrees[i].treeImage, myTrees[i].x, myTrees[i].y);
            }


            for (var i = 0; i < numSantas; i++)  //Draws santas
            {
                mySantas[i].santaImage.src = "images/snowboardsanta.gif";
                context.drawImage(mySantas[i].santaImage, mySantas[i].x, mySantas[i].y);
            }

            for (var i = 0; i < numSkiers; i++)  //Draws skiers
            {
                if (mySkiers[i].skiersDirection == "left")
                    mySkiers[i].skierImage.src = "images/skier2.gif";
                else
                    mySkiers[i].skierImage.src = "images/skier1.gif";
                context.drawImage(mySkiers[i].skierImage, mySkiers[i].x, mySkiers[i].y);
            }
            context.drawImage(mySkier, x, 175);

            if (crashedCounter2 == 1)
                context.drawImage(ow, x + 9, 165);

            if (direction == "paused") {

                context.drawImage(paused[2], 175, 212);
                context.strokeRect(175, 212, 150, 75);
            }
            context.fillStyle = "yellow";
            context.strokeRect(350, 0, 150, 73);
            context.fillStyle = "red";
            context.strokeRect(350, 1, 149, 72);

            context.fillText("Distance", 363, 20);
            context.fillText("=  " + distance + "  ft.", 431, 20);
            context.fillText("Score", 363, 40);
            context.fillText("=  " + score, 431, 40);
            context.fillText("High Score", 363, 60);

            if (score > highScore)  //Makes current score show up as high score if it 
            {
                context.fillStyle = "red";
                context.fillText("=", 431, 60);
                context.fillText("" + score, 451, 60);
                context.fillStyle = "black";
            }
            else
                context.fillText("=  " + highScore, 431, 60);
        } //largest else

        context.strokeRect(1, 1, 498, 498); //Draws a box around the game.

        context.strokeRect(0, 0, 85, 30);  //Fills in a box for sound on/off display.
        context.strokeRect(1, 1, 84, 29);  //Draws a box for sound on/off display.
        if (muted == true)  //Displays whether sound is on or off.
            context.fillText("Sound: Off", 15, 20);
        else
            context.fillText("Sound: On", 15, 20);

        setTimeout(animate, 33);
    } //animate();




    /*****************************
    moveSkier()
    ******************************/

    function moveSkier() {

        if (direction == "paused") {
            pausedCounter++;
            if (pausedCounter == 54)
                pausedCounter = 0;
        } //if
        else if (direction == "end" || direction == "exit") {
            if (score > highScore)  //Moves score into highScore if it is larger.
                highScore = score;
        } //else if
        else {

            if (direction == "downleft") {

                x = x - 4;  //Moves the snowboarder to the left.
                distance = distance + 2;  //Increments distance
                for (var i = 0; i < numMoguls; i++)   //Functions for moving the objects
                    myMoguls[i].moveMogul(7, Math.random());

                for (var i = 0; i < numRocks; i++)
                    myRocks[i].moveRock(7, Math.random());

                for (var i = 0; i < numTrees; i++)
                    myTrees[i].moveTree(7, Math.random());

                for (var i = 0; i < numSantas; i++)
                    mySantas[i].moveSanta(6, Math.random());

                for (var i = 0; i < numSkiers; i++)
                    mySkiers[i].moveSkier(4, Math.random());
                if (x < 2)  //Moves the snowboarder back if he crashes into the side
                {          //of the screen.
                    direction = "downright";
                    x = x + 8;
                }

            } //if - downleft

            if (direction == "downright")  //Snowboarder moves quickly down and right.
            {
                x = x + 4;  //Moves the snowboarder to the right.
                distance = distance + 2;  //Increments distance.
                for (var i = 0; i < numMoguls; i++)  //Functions for moving the objects.
                    myMoguls[i].moveMogul(7, Math.random());
                for (var i = 0; i < numRocks; i++)
                    myRocks[i].moveRock(7, Math.random());
                for (var i = 0; i < numTrees; i++)
                    myTrees[i].moveTree(7, Math.random());
                for (var i = 0; i < numSantas; i++)
                    mySantas[i].moveSanta(6, Math.random());
                for (var i = 0; i < numSkiers; i++)
                    mySkiers[i].moveSkier(4, Math.random());
                if (x > 481)  //Moves the snowboarder back if he crashes into the side
                {            //of the screen.
                    direction = "downleft";
                    x = x - 8;
                }
            } //if - downRight


            if (direction == "down")  //Snowboarder moves quickly down.
            {
                distance = distance + 2;  //Increments distance.
                armWave++;  //Increments armWave.
                for (var i = 0; i < numMoguls; i++)  //Functions for moving the objects.
                    myMoguls[i].moveMogul(7, Math.random());
                for (var i = 0; i < numRocks; i++)
                    myRocks[i].moveRock(7, Math.random());
                for (var i = 0; i < numTrees; i++)
                    myTrees[i].moveTree(7, Math.random());
                for (var i = 0; i < numSantas; i++)
                    mySantas[i].moveSanta(6, Math.random());
                for (var i = 0; i < numSkiers; i++)
                    mySkiers[i].moveSkier(4, Math.random());
            } //if - down

            if (direction == "left")  //Snowboarder moves slowly down and left.
            {
                x = x - 4;  //Moves the snowboarder to the left.
                distance = distance + 1;  //Increments distance.
                for (var i = 0; i < numMoguls; i++)  //Functions for moving the objects.
                    myMoguls[i].moveMogul(4, Math.random());
                for (var i = 0; i < numRocks; i++)
                    myRocks[i].moveRock(4, Math.random());
                for (var i = 0; i < numTrees; i++)
                    myTrees[i].moveTree(4, Math.random());
                for (var i = 0; i < numSantas; i++)
                    mySantas[i].moveSanta(3, Math.random());
                for (var i = 0; i < numSkiers; i++)
                    mySkiers[i].moveSkier(1, Math.random());
                if (x < 2)  //Moves the snowboarder back if he crashed into the side
                {          //of the screen
                    direction = "right";
                    x = x + 8;
                }
            } //if - left

            if (direction == "right")  //Snowboarder moves slowly down and right.
            {
                x = x + 4;  //Moves the snowboarder to the right.
                distance = distance + 1;  //Increments distance.
                for (var i = 0; i < numMoguls; i++)  //Functions for moving the objects.
                    myMoguls[i].moveMogul(4, Math.random());
                for (var i = 0; i < numRocks; i++)
                    myRocks[i].moveRock(4, Math.random());
                for (var i = 0; i < numTrees; i++)
                    myTrees[i].moveTree(4, Math.random());
                for (var i = 0; i < numSantas; i++)
                    mySantas[i].moveSanta(3, Math.random());
                for (var i = 0; i < numSkiers; i++)
                    mySkiers[i].moveSkier(1, Math.random());
                if (x > 481)  //Moves the snowboarder back if he crashes into the side
                {            //of the screen.
                    direction = "left";
                    x = x - 8;
                }
            } //if - right

            if (direction == "upleft")  //Snowboarder moves one step left.
            {
                x = x - 2;  //Moves the snowboarder to the left.
                for (var i = 0; i < numSantas; i++)  //Functions for moving the objects
                    mySantas[i].moveSanta(-3, Math.random());  //that continue to move when
                for (var i = 0; i < numSkiers; i++)  //the snowboarder does not.
                    mySkiers[i].moveSkier(-5, Math.random());
                if (x < 2)  //Moves the snowboarder back if he crashes into the side
                    x = x + 2;  //of the screen.
            } //if - upleft

            if (direction == "upright")  //Snowboarder moves one step right.
            {
                x = x + 2;  //Moves the snowboarder to the right.
                for (var i = 0; i < numSantas; i++)  //Functions for moving the objects
                    mySantas[i].moveSanta(-1, Math.random());  //that continue to move when
                for (var i = 0; i < numSkiers; i++)  //the snowboarder does not.
                    mySkiers[i].moveSkier(-3, Math.random());
                if (x > 481)  //Moves the snowboarder back if he crashes into the side
                    x = x - 2;  //of the screen.
            } //if - upright

            if (direction == "stop")  //Snowboarder does not move.
            {
                for (var i = 0; i < numSantas; i++)  //Functions for moving the objects                
                    mySantas[i].moveSanta(-1, Math.random());  //that continue to move when                                    
                for (var i = 0; i < numSkiers; i++)  //the snowboarder does not.
                    mySkiers[i].moveSkier(-3, Math.random());
            } //if - stop

            if (direction == "slowdown")  //Used for slower jumps only.
            {
                distance = distance + 1;  //Increments distance.
                for (var i = 0; i < numMoguls; i++)  //Functions for moving the objects.
                    myMoguls[i].moveMogul(4, Math.random());
                for (var i = 0; i < numRocks; i++)
                    myRocks[i].moveRock(4, Math.random());
                for (var i = 0; i < numTrees; i++)
                    myTrees[i].moveTree(4, Math.random());
                for (var i = 0; i < numSantas; i++)
                    mySantas[i].moveSanta(3, Math.random());
                for (var i = 0; i < numSkiers; i++)
                    mySkiers[i].moveSkier(1, Math.random());
                if (jumpedSlow == false)  //Sets direction to down if the snowboarder
                {  //is moving straight down at the end of a slow jump.
                    direction = "down";
                }
            } //if - slowdown

            if (direction == "crashed")  //Moves objects that continue to move when
            {                                //the snowboarder is crashed.
                for (var i = 0; i < numSantas; i++)
                    mySantas[i].moveSanta(-1, Math.random());
                for (var i = 0; i < numSkiers; i++)
                    mySkiers[i].moveSkier(-3, Math.random());
            } //if - crashed


            if (direction != "exit" && direction != "end") {
                if (jumped == false && jumpedSlow == false)
                    detectJump();  //Detects jumps when the snowboarder is not already jumped.
                if (jumped == true) {
                    jumpedCounter++;  //Increments the jumpedCounter.
                    jumpedScore();  //Calculates score if the snowboarder passes over
                    if (jumpedCounter == 75)  //anything while jumped.
                    {
                        jumped = false;  //Ends the jump after a set amount of time.
                        jumpedCounter = 0;
                    }
                }
                else if (jumpedSlow == true) {
                    jumpedCounter++;  //Increments the jumpedCounter.
                    jumpedSlowScore();  //Calculates score if the snowboarder passes over
                    if (jumpedCounter == 75)  //anything while jumped.
                    {
                        jumpedSlow = false;  //Ends the jump after a set amount of time.
                        jumpedCounter = 0;
                    }
                }
                else if (crashed == true) {
                    crashedCounter++;  //Increments crashedCounter.
                    if (crashedCounter == 15) {
                        crashed = false;  //Unlocks controls after a set amount of time.
                        crashedCounter = 0;
                    }
                }
                else
                    detectCrash();
                if (distance > 10000 && direction != "crashed")
                    direction = "end";  //Ends game if distance reaches 10,000.
            } //direction != "exit" && direction == "end"

        } //else BIGGER

    } //moveSkier()

    /*****************************
    detectJump()
    ******************************/

    function detectJump() {

        for (var i = 0; i < numMoguls; i++) {
            if ((myMoguls[i].x < (x + 10)) && (myMoguls[i].x > (x - 10)) && (myMoguls[i].y < 185) && (myMoguls[i].y > 165)) {
                if (direction == "down" || direction == "downleft" || direction == "downright") {
                    jumped = true;  //Jumped state for faster downward movement.
                    if (muted == false)
                        jump.play();  //Plays jump sound.
                    score = score + 50;  //Adds to score.
                } //if
                else if (direction == "left" || direction == "right") {
                    jumpedSlow = true;  //Jumped state for slower downward movement.
                    if (muted == false)
                        jump.play();  //Plays jump sound.
                    score = score + 25;  //Adds to score.
                } //else if
            } //Outer - if
        } //for

    } //detectJump()


    /*****************************
    jumpedScore()
    ******************************/

    function jumpedScore() {

        for (var i = 0; i < numRocks; i++) {
            if ((myRocks[i].x < (x + 10)) && (myRocks[i].x > (x - 10)) && (myRocks[i].y < 185) && (myRocks[i].y > 165)) {
                score = score + 100;  //Increments score for jumping rocks.
            }
        }
        for (var i = 0; i < numTrees; i++) {
            if ((myTrees[i].x < (x + 10)) && (myTrees[i].x > (x - 10)) && (myTrees[i].y < 185) && (myTrees[i].y > 165)) {
                score = score + 50;  //Increments score for jumping trees.
            }
        }
        for (var i = 0; i < numSantas; i++) {
            if ((mySantas[i].x < (x + 10)) && (mySantas[i].x > (x - 10)) && (mySantas[i].y < 185) && (mySantas[i].y > 165)) {
                score = score + 50;  //Increments score for jumping santas.
            }
        }
        for (var i = 0; i < numSkiers; i++) {
            if ((mySkiers[i].x < (x + 10)) && (mySkiers[i].x > (x - 10)) && (mySkiers[i].y < 185) && (mySkiers[i].y > 165)) {
                score = score + 150;  //Increments score for jumping skiers.
            }
        }

    } //jumpScore()


    /*****************************
    jumpedSlowScore()
    ******************************/

    function jumpedSlowScore() {
        for (var i = 0; i < numRocks; i++) {
            if ((myRocks[i].x < (x + 10)) && (myRocks[i].x > (x - 10)) && (myRocks[i].y < 185) && (myRocks[i].y > 165)) {
                score = score + 50;  //Increments score for jumping rocks.
            }
        }
        for (var i = 0; i < numTrees; i++) {
            if ((myTrees[i].x < (x + 10)) && (myTrees[i].x > (x - 10)) && (myTrees[i].y < 185) && (myTrees[i].y > 165)) {
                score = score + 25;  //Increments score for jumping trees.
            }
        }
        for (var i = 0; i < numSantas; i++) {
            if ((mySantas[i].x < (x + 10)) && (mySantas[i].x > (x - 10)) && (mySantas[i].y < 185) && (mySantas[i].y > 165)) {
                score = score + 25;  //Increments score for jumping santas
            }
        }
        for (var i = 0; i < numSkiers; i++) {
            if ((mySkiers[i].x < (x + 10)) && (mySkiers[i].x > (x - 10)) && (mySkiers[i].y < 185) && (mySkiers[i].y > 165)) {
                score = score + 75;  //Increments score for jumping skiers.
            }
        }

    } //jumpedSlowScore()

    /*****************************
    detectCrash()
    ******************************/

    function detectCrash() {

        if (crashedCounter2 == 0) {
            for (var i = 0; i < numRocks; i++) {
                if ((myRocks[i].x < (x + 10)) && (myRocks[i].x > (x - 10)) && (myRocks[i].y < 185) && (myRocks[i].y > 165)) {
                    direction = "crashed";  //Sets crashed states.
                    crashed = true;
                    crashedCounter++;  //Increments the crashed counters.
                    crashedCounter2++;
                    if (muted == false)
                        crashed2.play();  //Plays rock crash sound.
                    score = score - 400;  //Decreases score for hitting rocks.
                }
            }
            for (var i = 0; i < numTrees; i++) {
                if ((myTrees[i].x < (x + 10)) && (myTrees[i].x > (x - 10)) && (myTrees[i].y < 185) && (myTrees[i].y > 165)) {
                    direction = "crashed";  //Sets the crashed states.
                    crashed = true;
                    crashedCounter++;  //Increments the crashed counters.
                    crashedCounter2++;
                    if (muted == false)
                        crashed3.play();  //Plays the tree crash sound.
                    score = score - 300;  //Decreases score for hitting trees.
                }
            }
            for (var i = 0; i < numSantas; i++) {
                if ((mySantas[i].x < (x + 10)) && (mySantas[i].x > (x - 10)) && (mySantas[i].y < 185) && (mySantas[i].y > 165)) {
                    direction = "crashed";  //Sets the crashed states.
                    crashed = true;
                    crashedCounter++;  //Increments the crashed counters.
                    crashedCounter2++;
                    if (muted == false)
                        crashed1.play();  //Plays the squishy crash sound.
                    score = score - 250;  //Decreases score for hitting santa.
                }
            }
            for (var i = 0; i < numSkiers; i++) {
                if ((mySkiers[i].x < (x + 10)) && (mySkiers[i].x > (x - 10)) && (mySkiers[i].y < 185) && (mySkiers[i].y > 165)) {
                    direction = "crashed";  //Sets the crashed states.
                    crashed = true;
                    crashedCounter++;  //Increments the crashed counters.
                    crashedCounter2++;
                    if (muted == false)
                        crashed1.play();  //Plays the squishy crash sound.
                    score = score - 500;  //Decreases score for hitting skiers.
                }
            }
        }
        else if (direction != "crashed")  //Disables crash detection for the first
        {  //few movements after a crash to keep from hitting the same object more than
            crashedCounter2++;  //once.
            if (crashedCounter2 == 3)
                crashedCounter2 = 0;
        }


    } //detectCrash()


});                                                                                //Document Ready

/************************************

ALL CLASSES BELOW

*****************************************/

function Moguls() {

    this.x= null,
    this.y= null,
    this.mogulImage = new Image(),

    this.newMogul = function (g1) {
        do {
            this.x = (g1 * 480) + 2;
            this.y = (g1 * 480) + 2;
        }
        while (this.x < 265 && this.x > 235 && this.y < 190 && this.y > 160);
    }, //newMogul()


    this.moveMogul = function (y1, g1) {
        this.y = this.y - y1;
        if (this.y < 2) {
            this.y = 498;
            this.x = (g1 * 480) + 2;
        }
    } //MoveMogul()
};   //mogul Class

function Rocks(){
    this.x = null,
    this.y = null,
    this.rockImage =  new Image(),

    this.newRock = function (g1) {
        do {
            this.x = (g1 * 480) + 2;
            this.y = (g1 * 480) + 2;
        }
        while (this.x < 265 && this.x > 235 && this.y < 190 && this.y > 160);
    }, //newRock()

    this.moveRock =  function (y1, g1) {
        this.y = this.y - y1;
        if (this.y < 2) {
            this.y = 498;
            this.x = (g1 * 480) + 2;
        }
    } //moveRock()
};   //Rocks Class

 function Trees(){

    this.x= null,
    this.y= null,
    this.treeImage = new Image(),

    this.newTree =  function (g1) {
        do {
            this.x = (g1 * 480) + 2;
            this.y = (g1 * 480) + 2;
        }
        while (this.x < 265 && this.x > 235 && this.y < 190 && this.y > 160);
    }, //newTree()

    this.moveTree = function (y1, g1) {
        this.y = this.y - y1;
        if (this.y < 2) {
            this.y = 498;
            this.x = (g1 * 480) + 2;
        }
    } //MoveTree()
};   //Tree Class

function Santas() {

    this.x = null,
    this.y = null,
    this.santaImage =  new Image(),

    this.newSanta = function (g1) {
        do {
            this.x = (g1 * 480) + 2;
            this.y = (g1 * 480) + 2;
        }
        while (this.x < 265 && this.x > 235 && this.y < 190 && this.y > 160);
    }, //newSanta()

    this.moveSanta = function (y1, g1) {
        this.y = this.y - y1;
        if (this.y < 2) {
            this.y = 498;
            this.x = (g1 * 480) + 2;
        }
        if (this.y > 498)  //New santa at top of screen if one leaves the bottom of the screen.
        {
            this.y = 2;
            this.x = (g1 * 480) + 2;
        }

    } //MoveSanta()
};    //Santas Class

function Skiers(){

    this.x = null,
    this.y = null,
    this.speed= null,
    this.skiersDirection= null,
    this.skiersCounter= null,
    this.skiersChange= null,
    this.skierImage= new Image(),

    this.newSkier= function (g1) {
        do {
            this.x = (g1 * 480) + 2;
            this.y = (g1 * 480) + 2;
        }
        while (this.x < 265 && this.x > 235 && this.y < 190 && this.y > 160);
        if (((g1 * 2) + 1) == 1)  //Randomly generates direction of skier.
            this.skiersDirection = "left";
        else
            this.skiersDirection = "right";
        this.skiersCounter = 0;
        this.skiersChange = (g1 * 20) + 1;  //Sets how often the skier 
        this.speed = (g1 * 3) - 1;  //changes direction and variable speed.

    }, //newSanta()

    this.moveSkier= function (y1, g1) {
        this.skiersCounter++;
        if (this.skiersCounter > this.skiersChange)  //Chance to change direction after a random
        {                                 //amount of time.
            if (((g1 * 2) + 1) == 1)
                this.skiersDirection = "left";
            else
                this.skiersDirection = "right";
            this.skiersCounter = 0;
            this.skiersChange = (g1 * 20) + 1;
        }
        this.y = this.y - y1 - this.speed;
        if (this.skiersDirection == "left")
            this.x = this.x - 3 + this.speed;
        else
            this.x = this.x + 3 - this.speed;
        if (this.y < 2)  //Generates a new skier at the bottom if one leaves the top of the screen.
        {
            this.y = 498;
            this.x = (g1 * 480) + 2;
            if (((g1 * 2) + 1) == 1)
                this.skiersDirection = "left";
            else
                this.skiersDirection = "right";
            this.speed = (g1 * 3) - 1;
        }
        if (this.y > 498)  //Generates a new skier at the top if one leaves the bottom of the screen.
        {
            this.y = 2;
            this.x = (g1 * 480) + 2;
            if (((g1 * 2) + 1) == 1)
                this.skiersDirection = "left";
            else
                this.skiersDirection = "right";
            this.speed = (g1 * 3) - 1;
        }
        if (this.x > 481)  //Pushes skiers back if they collide with the right side.
        {
            this.x = this.x - 6 + this.speed;
            this.skiersDirection = "left";
        }
        if (this.x < 2)  //Pushes skiers back if they collide with the left side.
        {
            this.x = this.x + 6 - this.speed;
            this.skiersDirection = "right";
        }

    } //MoveSkier()
};   //Skiers Class




