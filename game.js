const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  input: {
    activePointers: 3  // Configuración para permitir el uso de hasta 3 dedos (o toques)
  }
};

let player;
let car;
let bullets;
let npcs;
let banks;
let cursors;
let touchMove = { x: 0, y: 0 }; // Almacenará la posición táctil para el control del movimiento

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('car', 'assets/car.png');
  this.load.image('npc', 'assets/npc.png');
  this.load.image('bank', 'assets/bank.png');
  this.load.image('bullet', 'assets/bullet.png');
}

function create() {
  player = this.physics.add.sprite(400, 300, 'player');
  player.setCollideWorldBounds(true);

  car = this.physics.add.sprite(600, 400, 'car');
  car.setCollideWorldBounds(true);

  bullets = this.physics.add.group({
    defaultKey: 'bullet',
    maxSize: 10
  });

  npcs = this.physics.add.group();
  for (let i = 0; i < 5; i++) {
    npcs.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'npc');
  }

  banks = this.physics.add.group();
  for (let i = 0; i < 3; i++) {
    banks.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'bank');
  }

  // Táctil: detecta el toque para mover al jugador y disparar
  this.input.on('pointermove', (pointer) => {
    touchMove.x = pointer.x;
    touchMove.y = pointer.y;
  });

  // Táctil: detecta el toque para disparar
  this.input.on('pointerdown', (pointer) => {
    if (pointer.x < 400) {
      shootBullet();
    }
  });
}

function update() {
  // Movimiento táctil
  if (touchMove.x > player.x + 50) {
    player.x += 5;
  }
  if (touchMove.x < player.x - 50) {
    player.x -= 5;
  }
  if (touchMove.y > player.y + 50) {
    player.y += 5;
  }
  if (touchMove.y < player.y - 50) {
    player.y -= 5;
  }

  // Movimiento del coche
  if (this.input.pointer1.isDown) {
    const touchX = this.input.pointer1.x;
    const touchY = this.input.pointer1.y;
    if (touchX > car.x + 50) {
      car.x += 5;
    }
    if (touchX < car.x - 50) {
      car.x -= 5;
    }
    if (touchY > car.y + 50) {
      car.y += 5;
    }
    if (touchY < car.y - 50) {
      car.y -= 5;
    }
  }

  // Colisiones
  this.physics.add.collider(bullets, npcs, hitNpc, null, this);
  this.physics.add.collider(bullets, banks, hitBank, null, this);
}

function shootBullet() {
  const bullet = bullets.get(player.x, player.y);
  if (bullet) {
    bullet.setActive(true).setVisible(true);
    this.physics.moveTo(bullet, player.x, player.y - 500, 300);
  }
}

function hitNpc(bullet, npc) {
  bullet.setActive(false).setVisible(false);
  npc.setActive(false).setVisible(false);
}

function hitBank(bullet, bank) {
  bullet.setActive(false).setVisible(false);
  bank.setActive(false).setVisible(false);
}

const game = new Phaser.Game(config);
