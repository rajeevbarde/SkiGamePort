window.addEvent('domready', function () {

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
    var start;  //Image for startup screen.
    var exit;  //Image for exit game screen.
    var end;  //Image for end game screen.
    var mySkier;  //Image for snowboarder.
    var ow;
    // var paused[] = new Image[6];  //Images for animated paused display.
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

    //Class - Objects
    //var myMoguls = new Moguls();  //Array of mogul objects.
    var i = 0;
    var myMoguls = null;
    for (i = 0; i < 5; i++) {
        
    }
    myMoguls[0] = new Moguls();

    //  var mySkiers[] = new Skiers[4];  //Array of skier objects.
    //  var  myRocks[] = new Rocks[10];  //Array of rock objects.
    //  var  myTrees[] = new Trees[20];  //Array of tree objects.
    // var  mySantas[] = new Santas[3];  //Array of santa objects.

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

    //Random
    var Generate1; //= new Random();

    alert(Math.random());

});               //domready





/*  ************************   
        CLASS DEFINATION BELOW

*********************************** */

var Moguls = new Class({

    x: null,
    y: null,
    mogulImage: null,

    newMogul: function (g1) {
        do {
            x = (int)(g1.nextDouble() * 480) + 2;
            y = (int)(g1.nextDouble() * 480) + 2;
        }
        while (x < 265 && x > 235 && y < 190 && y > 160);
    }, //newMogul()


    MoveMogul: function (y1, g1) {
        y = y - y1;
        if (y < 2) {
            y = 498;
            x = (int)(g1.nextDouble() * 480) + 2;
        }
    } //MoveMogul()
});   //mogul Class

var Rocks = new Class({
    x: null,
    y: null,
    rockImage: null,

    newRock: function (g1) {
        do  //Loop keeps rocks from generating on top of the snowboarder.
        {
            x = (int)(g1.nextDouble() * 480) + 2;
            y = (int)(g1.nextDouble() * 480) + 2;
        }
        while (x < 265 && x > 235 && y < 190 && y > 160);
    }, //newRock()

    moveRock: function (y1, g1) {
        y = y - y1;
        if (y < 2) {
            y = 498;
            x = (int)(g1.nextDouble() * 480) + 2;
        }
    } //moveRock()
});   //Rocks Class

var Trees = new Class({

    x: null,
    y: null,
    treeImage: null,

    newTree: function (g1) {
        do {
            x = (int)(g1.nextDouble() * 480) + 2;
            y = (int)(g1.nextDouble() * 480) + 2;
        }
        while (x < 265 && x > 235 && y < 190 && y > 160);
    }, //newTree()


    MoveTree: function (y1, g1) {
        y = y - y1;
        if (y < 2) {
            y = 498;
            x = (int)(g1.nextDouble() * 480) + 2;
        }
    } //MoveTree()
});   //Tree Class

var Santas = new Class({

    x: null,
    y: null,
    santaImage: null,

    newSanta: function (g1) {
        do {
            x = (int)(g1.nextDouble() * 480) + 2;
            y = (int)(g1.nextDouble() * 480) + 2;
        }
        while (x < 265 && x > 235 && y < 190 && y > 160);
    }, //newSanta()

    MoveSanta: function (y1, g1) {
        y = y - y1;
        if (y < 2) {
            y = 498;
            x = (int)(g1.nextDouble() * 480) + 2;
        }
        if (y > 498)  //New santa at top of screen if one leaves the bottom of the screen.
        {
            y = 2;
            x = (int)(g1.nextDouble() * 480) + 2;
        }

    } //MoveSanta()
});   //Santas Class


var Skiers = new Class({

    x: null,
    y: null,
    speed: null,
    skiersDirection: null,
    skiersCounter: null,
    skiersChange: null,
    skierImage: null,

    newSkier: function (g1) {
        do {
            x = (int)(g1.nextDouble() * 480) + 2;
            y = (int)(g1.nextDouble() * 480) + 2;
        }
        while (x < 265 && x > 235 && y < 190 && y > 160);
        if (((int)(g1.nextDouble() * 2) + 1) == 1)  //Randomly generates direction of skier.
            skiersDirection = "left";
        else
            skiersDirection = "right";
        skiersCounter = 0;
        skiersChange = (int)(g1.nextDouble() * 20) + 1;  //Sets how often the skier 
        speed = (int)(g1.nextDouble() * 3) - 1;  //changes direction and variable speed.

    }, //newSanta()

    MoveSkier: function (y1, g1) {
        skiersCounter++;
        if (skiersCounter > skiersChange)  //Chance to change direction after a random
        {                                 //amount of time.
            if (((int)(g1.nextDouble() * 2) + 1) == 1)
                skiersDirection = "left";
            else
                skiersDirection = "right";
            skiersCounter = 0;
            skiersChange = (int)(g1.nextDouble() * 20) + 1;
        }
        y = y - y1 - speed;
        if (skiersDirection == "left")
            x = x - 3 + speed;
        else
            x = x + 3 - speed;
        if (y < 2)  //Generates a new skier at the bottom if one leaves the top of the screen.
        {
            y = 498;
            x = (int)(g1.nextDouble() * 480) + 2;
            if (((int)(g1.nextDouble() * 2) + 1) == 1)
                skiersDirection = "left";
            else
                skiersDirection = "right";
            speed = (int)(g1.nextDouble() * 3) - 1;
        }
        if (y > 498)  //Generates a new skier at the top if one leaves the bottom of the screen.
        {
            y = 2;
            x = (int)(g1.nextDouble() * 480) + 2;
            if (((int)(g1.nextDouble() * 2) + 1) == 1)
                skiersDirection = "left";
            else
                skiersDirection = "right";
            speed = (int)(g1.nextDouble() * 3) - 1;
        }
        if (x > 481)  //Pushes skiers back if they collide with the right side.
        {
            x = x - 6 + speed;
            skiersDirection = "left";
        }
        if (x < 2)  //Pushes skiers back if they collide with the left side.
        {
            x = x + 6 - speed;
            skiersDirection = "right";
        }


    } //MoveSkier()
});   //Skiers Class
