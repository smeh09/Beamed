const container = document.querySelector("#container");

const TILE_SIZE = 600 / 10;

let playerX = 300;
let playerY = 487.5;
let playerA = 90;

let movingR = false;
let movingL = false;
let movingT = false;
let movingB = false;

let angleA = false;
let angleS = false;

let playerV = [0, 0];

const maxlen = 50;

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const degrees = (radians) => {
  return radians * (180 / Math.PI);
};

const radians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const line = (x1, y1, x2, y2, thickness, color) => {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = -degrees(Math.atan2(x2 - x1, y2 - y1));
  
  const line = document.createElement('div');
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.width = `${distance}px`;
  line.style.height = `${thickness}px`;
  line.style.backgroundColor = `rgb(${color.toString()})`;
  line.style.transformOrigin = `0 ${thickness/2}px`;
  line.style.transform = `rotate(${angle + 90}deg)`;

  container.appendChild(line);

  return line;
};

const updateLine = (line, x1, y1, x2, y2, thickness, color) => {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = -degrees(Math.atan2(x2 - x1, y2 - y1));

  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.width = `${distance}px`;
  line.style.height = `${thickness}px`;
  line.style.backgroundColor = `rgb(${color.toString()})`;
  line.style.transformOrigin = `0 ${thickness/2}px`;
  line.style.transform = `rotate(${angle + 90}deg)`;

  return line;
}

const collide = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
  );
};

const loadColliders = () => {
  let colliders = [];
  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === 1) {
        colliders.push([x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE]);
      }
    });
  });
  return colliders;
};

const colliders = loadColliders();

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyD') {
    movingR = true;
  }
  if (event.code === 'KeyA') {
    movingL = true;
  }
  if (event.code === 'KeyW') {
    movingT = true;
  }
  if (event.code === 'KeyS') {
    movingB = true;
  }
  if (event.code == 'ArrowRight') {
    angleS = true;
  }
  if (event.code == 'ArrowLeft') {
    angleA = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyD') {
    movingR = false;
  }
  if (event.code === 'KeyA') {
    movingL = false;
  }
  if (event.code === 'KeyW') {
    movingT = false;
  }
  if (event.code === 'KeyS') {
    movingB = false;
  }
  if (event.code == 'ArrowRight') {
    angleS = false;
  }
  if (event.code == 'ArrowLeft') {
    angleA = false;
  }
});

const FOV = 60;

// create raycast
let rayX = playerX, rayY = playerY;
let rayLines = [];
for(let i = 0; i < FOV; i++) {
  rayLines.push(line(playerX, playerY, rayX, rayY, 2, [0, 255, 100]));
}

// 3d scene
let sceneLines = [];
for (let i = 0; i < FOV; i++) {
  sceneLines.push(line(playerX, playerY, playerX, playerY, 2, [0, 255, 100]));
}
let lineX = 0;
const originalColor = [225, 225, 225];
let color = JSON.parse(JSON.stringify(originalColor));

// create player
const player = document.createElement('div');

player.style.left = `${playerX - 15 / 2}px`;
player.style.top = `${playerY - 15 / 2}px`;
player.style.width = '15px';
player.style.height = '15px';
player.style.background = 'yellow';

// container.appendChild(player);

let lastTimestamp;
const update = (timestamp) => {
  const deltatime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  let playerV = [0, 0,]

  if (angleA) {
    playerA -= 75 * deltatime;
  }
  if (angleS) {
    playerA += 75 * deltatime;
  }
  if (movingT) {
    playerV[0] += Math.cos(radians(playerA)) * 150 * deltatime;
    playerV[1] -= Math.sin(radians(playerA)) * 150 * deltatime;
  }
  if (movingB) {
    playerV[0] -= Math.cos(radians(playerA)) * 150 * deltatime;
    playerV[1] += Math.sin(radians(playerA)) * 150 * deltatime;
  }
  if (movingR) {
    playerV[0] += Math.cos(radians(playerA + 90)) * 150 * deltatime;
    playerV[1] -= Math.sin(radians(playerA + 90)) * 150 * deltatime;
  }
  if (movingL) {
    playerV[0] += Math.cos(radians(playerA - 90)) * 150 * deltatime;
    playerV[1] -= Math.sin(radians(playerA - 90)) * 150 * deltatime;
  }

  playerX += playerV[0];
  playerY += playerV[1];

  let rayA = playerA - FOV/2;

  lineX = -5;

  for (let i = 0; i < FOV; i++) {
    rayX = playerX;
    rayY = playerY;
    rayA += 1;

    if (collide({'x': playerX, 'y': playerY, 'w': 151, 'h': 15}, {'x': 0, 'y': 0, 'w': 600, 'h': 600})) {
      let colliding = [];
      colliders.forEach((collider, index) => {
        colliding.push(collide({ 'x': rayX, 'y': rayY, 'w': 1, 'h': 1 }, { 'x': collider[0], 'y': collider[1], 'w': collider[2], 'h': collider[3] }))
      });

      let len = 0;
      while (colliding.indexOf(true) === -1) {
        rayX += Math.cos(radians(rayA)) * 2;
        rayY -= Math.sin(radians(rayA)) * 2; 

        colliding = [];
        colliders.forEach((collider, index) => {
          colliding.push(collide({ 'x': rayX, 'y': rayY, 'w': 1, 'h': 1 }, { 'x': collider[0], 'y': collider[1], 'w': collider[2], 'h': collider[3] }))
        });

        len++;
      }

      colliders.forEach((collider, index) => {
        while (collide({ 'x': rayX, 'y': rayY, 'w': 1, 'h': 1 }, { 'x': collider[0], 'y': collider[1], 'w': collider[2], 'h': collider[3] })) {
          rayX -= Math.cos(radians(rayA)) * 0.5;
          rayY += Math.sin(radians(rayA)) * 0.5;
        }
      });
    }

    color = JSON.parse(JSON.stringify(originalColor));
    let off = 600 / FOV;
    lineX += off;
    let dist;
    dist = Math.sqrt((rayX - playerX)*(rayX - playerX) + (rayY - playerY)*(rayY - playerY)) * Math.cos(radians(rayA) - radians(playerA));
    let height = (20000/dist);
    color[0] += -dist/3;
    color[1] += -dist/3;
    color[2] += -dist/3;
    updateLine(sceneLines[i], lineX, 300 - height/2, lineX, 300 + height/2, 600/FOV+1, color);
  }

  player.style.left = `${playerX - 15 / 2}px`;
  player.style.top = `${playerY - 15 / 2}px`;

  window.requestAnimationFrame(update);
};

window.requestAnimationFrame((timestamp) => {
  lastTimestamp = timestamp;
  window.requestAnimationFrame(update);
});