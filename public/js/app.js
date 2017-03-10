var game = new Phaser.Game(870, 645, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {

    game.load.tilemap('map', 'assets/level2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tiles.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.spritesheet('player', 'assets/spaceman.png', 16, 16);

}

var globalState = {};

var map;
var layer;
var cursors;
var player;
var moving;
var devs, dev;
var actionKeys;
var hitDev, interactionText, isInteracting;
var devs, devsArray = [], devsInfo = [
    {
        'name': 'Fabricio Sodano',
        'avatar': 'https://avatars.githubusercontent.com/fsodano',
        'position': {'x': 32, 'y': 208}
    },
    {
        'name': 'Sebastien Caietta',
        'avatar': 'https://avatars.githubusercontent.com/sebastiencaietta',
        'position': {'x': 32, 'y': 256}
    },
    {
        'name': 'Marcos Duarte',
        'avatar': 'https://avatars.githubusercontent.com/maarcosd',
        'position': {'x': 32, 'y': 304}
    }
];
var dialogOptions = [
    {'text': 'What do you do?', 'callback': job},
    {'text': 'What\'s your story?', 'callback': story},
    {'text': 'Nevermind', 'callback': clearInteractionState},
];
var dialogMenu = [], dialogChoice;
var dialogIndex = 0;
var dialogChoiceIcon;

function createDevs() {
    devs = game.add.group();
    devs.enableBody = true;
    for (var index in devsInfo) {
        if (devsInfo.hasOwnProperty(index)) {
            var devInfo = devsInfo[index];
            dev = devs.create(devInfo.position.x, devInfo.position.y, 'player', 2);
            dev.key = 'p' + index;
            dev.information = devInfo;
            devsArray.push(dev);
        }
    }
}

function job() {
    console.log('job');
}
function story() {
    console.log('story');
}
function clearInteractionState() {
    isInteracting = false;
    for (i = 0; i < dialogMenu.length; i++) {
        var text = dialogMenu[i];
        text.destroy();
    }
    dialogChoiceIcon.destroy();
    interactionText.destroy();
    initWalkingState();
    cursors.up.onDown.removeAll();
    cursors.down.onDown.removeAll();

}

function initWalkingState() {
    actionKeys = game.input.keyboard.addKeys({'enter': Phaser.KeyCode.ENTER});
    actionKeys.enter.onDown.add(interact, this);
    interactionText = game.add.text(32, 32, '', {fontSize: '32px', backgroundColor: '#fff'});
}

function interact() {
    if (hitDev) {
        var dev = window.globalState.activeDeveloper;
        var y;

        dialogIndex = 0;
        isInteracting = true;
        interactionText.text = "Hi, I'm " + dev.information.name + ", what do you want to know about me?";
        dialogChoiceIcon = game.add.sprite(32, 96, 'player', 1);
        dialogMenu = [];
        for (var i = 0; i < dialogOptions.length; i++) {
            y = 96 + i * 64;
            dialogChoice = game.add.text(64, y, dialogOptions[i]['text'], {
                fontSize: '32px',
                backgroundColor: 'white',
                fill: i === 0 ? 'blue' : 'black'
            });
            dialogMenu.push(dialogChoice);
        }

        cursors.up.onDown.add(function () {
            if (dialogIndex > 0) {
                dialogChoiceIcon.y -= 64;
                dialogIndex--;
                dialogMenu[dialogIndex + 1].fill = 'black';
                dialogMenu[dialogIndex].fill = 'blue';
            }
        }, this);
        cursors.down.onDown.add(function () {
            if (dialogIndex < dialogOptions.length - 1) {
                dialogChoiceIcon.y += 64;
                dialogIndex++;
                dialogMenu[dialogIndex - 1].fill = 'black';
                dialogMenu[dialogIndex].fill = 'blue';
            }
        }, this);

        actionKeys.enter.onDown.removeAll();
        actionKeys.enter.onDown.add(
            function () {
                dialogOptions[dialogIndex].callback()
            }, this);
    }
}

function create() {

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    map = game.add.tilemap('map', 15, 15);

    //  Now add in the tileset
    map.addTilesetImage('tiles');

    //  Create our layer
    layer = map.createLayer(0);

    //  Resize the world
    layer.resizeWorld();

    map.setCollisionBetween(1, 2);


    // Un-comment this on to see the collision tiles
    // layer.debug = true;

    //  Player
    player = game.add.sprite(48, 48, 'player', 1);
    player.animations.add('left', [8, 9], 10, true);
    player.animations.add('right', [1, 2], 10, true);
    player.animations.add('up', [11, 12, 13], 10, true);
    player.animations.add('down', [4, 5, 6], 10, true);

    // dev.body.setSize(10, 14, 2, 1);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.setSize(10, 14, 2, 1);
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();


    createDevs();

    initWalkingState();

}

function update() {

    game.physics.arcade.collide(player, layer);
    hitDev = game.physics.arcade.overlap(player, devs, function (thePlayer, theDev) {
        window.globalState.activeDeveloper = theDev;
    });

    player.body.velocity.set(0);
    moving = false;


    if (!isInteracting) {
        if (cursors.left.isDown) {
            moving = true;
            player.body.velocity.x = -200;
            player.play('left');
        }
        if (cursors.right.isDown) {
            moving = true;
            player.body.velocity.x = 200;
            player.play('right');
        }
        if (cursors.up.isDown) {
            moving = true;
            player.body.velocity.y = -200;
            player.play('up');
        }
        if (cursors.down.isDown) {
            moving = true;
            player.body.velocity.y = 200;
            player.play('down');
        }
    }

    if (!moving) {
        player.animations.stop();
    }


}

function render() {

    // game.debug.body(player);

}
