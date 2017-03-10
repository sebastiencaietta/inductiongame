var game = new Phaser.Game(870, 645, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {

    game.load.tilemap('map', 'public/assets/level2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'public/assets/tiles.png');
    game.load.image('platform', 'public/assets/platform.png');
    game.load.spritesheet('player', 'public/assets/spaceman.png', 16, 16);

}

var map;
var layer;
var cursors;
var player;

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


    //  Un-comment this on to see the collision tiles
    layer.debug = true;

    //  Player
    player = game.add.sprite(48, 48, 'player', 1);
    player.animations.add('left', [8, 9], 10, true);
    player.animations.add('right', [1, 2], 10, true);
    player.animations.add('up', [11, 12, 13], 10, true);
    player.animations.add('down', [4, 5, 6], 10, true);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.setSize(10, 14, 2, 1);
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

    var help = game.add.text(16, 16, 'Arrows to move', {font: '14px Arial', fill: '#ffffff'});
    help.fixedToCamera = true;

}

function update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.set(0);

    if (cursors.left.isDown) {
        player.body.velocity.x = -100;
        player.play('left');
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 100;
        player.play('right');
    }
    else if (cursors.up.isDown) {
        player.body.velocity.y = -100;
        player.play('up');
    }
    else if (cursors.down.isDown) {
        player.body.velocity.y = 100;
        player.play('down');
    }
    else {
        player.animations.stop();
    }

}

function render() {

    // game.debug.body(player);

}