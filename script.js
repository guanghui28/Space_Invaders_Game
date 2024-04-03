/** @type {HTMLCanvasElement}*/
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "black";

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.rotation = 0;
        const image = new Image();
        image.src = "./images/spaceship.png";
        image.onload = () => {
            const scale = 0.15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20,
            };
        };
        this.opacity = 1;
        this.gunPower = 0;
    }

    draw() {
        if (this.image) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(
                this.position.x + this.width / 2,
                this.position.y + this.height / 2
            );
            ctx.rotate(this.rotation);

            ctx.translate(
                -this.position.x - this.width / 2,
                -this.position.y - this.height / 2
            );

            ctx.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
            ctx.restore();
        }
    }
    update() {
        this.draw();
        if (this.image) {
            this.position.x += this.velocity.x;
        }
    }
}

class Invader {
    constructor(position) {
        this.velocity = {
            x: 0,
            y: 0,
        };
        const image = new Image();
        image.src = "./images/invader.png";
        image.onload = () => {
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y,
            };
        };
    }

    draw() {
        if (this.image) {
            ctx.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        }
    }
    update(velocity) {
        this.draw();
        if (this.image) {
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }
    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new InvaderProjectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height,
                },
                velocity: {
                    x: 0,
                    y: 5,
                },
            })
        );
    }
}

class Projectile {
    constructor({ position, velocity, level = 1 }) {
        this.position = position;
        this.velocity = velocity;
        this.level = level;
        this.radius = this.level * 1.2 + 4;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2,
            false
        );
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const giftColors = ["blue", "violent", "green"];

class Gift {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 8;
        this.color = giftColors[Math.floor(Math.random() * giftColors.length)];
        this.power = "blue" ? 1 : "violent" ? 2 : 3;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2,
            false
        );
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 4;
        this.height = 8;
    }
    draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Particle {
    constructor(position, velocity, radius, color, fades) {
        this.radius = 4;
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.alpha = 1;
        this.fades = fades;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2,
            false
        );
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.fades) {
            this.alpha -= 0.01;
        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
        };
        this.velocity = {
            x: 3,
            y: 0,
        };
        this.invaders = [];
        const columns = Math.floor(Math.random() * 8 + 2);
        const rows = Math.floor(Math.random() * 4 + 2);
        this.width = columns * 30;
        this.height = rows * 30;
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                this.invaders.push(new Invader({ x: i * 30, y: j * 30 }));
            }
        }
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;
        if (
            this.position.x + this.width >= canvas.width ||
            this.position.x <= 0
        ) {
            this.velocity.x *= -1;
            this.velocity.y = 30;
        }
    }
}

function createParticles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(
            new Particle(
                {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2,
                },
                {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2,
                },
                Math.random() * 3,
                color || "#BAA0DE",
                fades
            )
        );
    }
}

const historyScore = [];
let randomInterval = Math.floor(Math.random() * 500) + 500;
let player;
let projectiles;
let grids;
let invaderProjectiles;
let particles;
let frames;
let score;
const game = {
    isActive: false,
    isOver: false,
};
let gifts;

const scoreEl = document.getElementById("scoreEl");
const startBtn = document.getElementById("start-btn");
const bgEl = document.querySelector(".background-button");
const resetContainer = document.querySelector(".reset-game-container");
const resetBtn = document.getElementById("reset-btn");
const lastScoreEl = document.getElementById("last-score");
const maxScoreEl = document.getElementById("max-score");
//audio
const startAudio = new Audio("./audio/start.mp3");
const shootAudio = new Audio("./audio/shoot.wav");
const enemyShootAudio = new Audio("./audio/enemyShoot.wav");
const gameOverAudio = new Audio("./audio/gameOver.mp3");
const explodeAudio = new Audio("./audio/explode.wav");
const backgroundAudio = new Audio("./audio/backgroundMusic.wav");

backgroundAudio.loop = true;
backgroundAudio.play();

const keys = {
    left: {
        pressed: false,
    },
    right: {
        pressed: false,
    },
    hit: {
        pressed: false,
    },
};

function init() {
    game.isOver = false;
    game.isActive = true;
    player = new Player();
    projectiles = [];
    grids = [];
    invaderProjectiles = [];
    particles = [];
    gifts = [];
    frames = 0;
    score = 0;
    scoreEl.textContent = score;
    createBackgroundStars();
}

function createBackgroundStars() {
    // create background - stars
    for (let i = 0; i < 200; i++) {
        particles.push(
            new Particle(
                {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                },
                {
                    x: 0,
                    y: 0.2,
                },
                Math.random() * 2,
                "gold"
            )
        );
    }
}

function resetUI() {
    const lastScore = historyScore[historyScore.length - 1];
    const maxScore = Math.max(...historyScore);
    lastScoreEl.textContent = lastScore;
    maxScoreEl.textContent = maxScore;
    resetContainer.style.display = "block";
}
resetBtn.addEventListener("click", () => {
    resetContainer.style.display = "none";
    init();
    startAudio.play();
});

// click start button
startBtn.addEventListener("click", () => {
    init();
    bgEl.style.display = "none";
    startAudio.play();
});

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!game.isActive) return;
    player.update();
    particles.forEach((particle, index) => {
        if (particle.position.y - particle.radius > canvas.height) {
            particle.position.x = Math.random() * canvas.width;
            particle.position.y = Math.random() * canvas.height;
        }
        if (particle.alpha <= 0) {
            setTimeout(() => {
                particles.splice(index, 1);
            }, 0);
        } else particle.update();
    });
    gifts.forEach((gift, index) => {
        if (
            gift.position.y + gift.radius >= player.position.y &&
            gift.position.x + gift.radius >= player.position.x &&
            gift.position.x <= player.position.x + player.width
        ) {
            player.gunPower += gift.power;
            setTimeout(() => gifts.splice(index, 1), 0);
        } else if (gift.position.y + gift.radius >= canvas.height) {
            setTimeout(() => gifts.splice(index, 1), 0);
        } else gift.update();
    });
    projectiles.forEach((projectile, index) => {
        // remove projectile if it's not in screen
        if (projectile.position.y + projectile.radius < 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        } else {
            projectile.update();
        }
    });

    invaderProjectiles.forEach((invaderProjectile, index) => {
        // remove invader's projectile when it's not on screen

        if (
            invaderProjectile.position.y + invaderProjectile.height >
            canvas.height
        ) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1);
            }, 0);
        } else {
            invaderProjectile.update();
        }

        // invader projectile hit the player
        if (
            invaderProjectile.position.y + invaderProjectile.height >=
                player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >=
                player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width
        ) {
            // explosion particle
            gameOverAudio.play();
            createParticles({
                object: { ...player },
                color: "white",
                fades: true,
            });
            player.opacity = 0;
            game.isOver = true;
            historyScore.push(score);
            setTimeout(() => {
                game.isActive = false;
                resetUI();
            }, 2000);
        }
    });
    // print out each of grid invaders
    grids.forEach((grid, gridIndex) => {
        grid.update();
        // spawn invader projectile
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[
                Math.floor(Math.random() * grid.invaders.length)
            ].shoot(invaderProjectiles);
            enemyShootAudio.play();
        }
        grid.invaders.forEach((invader, i) => {
            invader.update(grid.velocity);

            // projectile hit invader
            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius <=
                        invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >=
                        invader.position.x &&
                    projectile.position.x - projectile.radius <=
                        invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >=
                        invader.position.y
                ) {
                    // explosion particles
                    createParticles({
                        object: { ...invader },
                        color: "",
                        fades: true,
                    });
                    setTimeout(() => {
                        // remove invader and projectile if it hit each others
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        );
                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        );
                        if (invaderFound && projectileFound) {
                            score += 100;
                            scoreEl.textContent = score;
                            projectiles.splice(j, 1);
                            grid.invaders.splice(i, 1);
                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0];
                                const lastInvader =
                                    grid.invaders[grid.invaders.length - 1];

                                grid.width =
                                    lastInvader.position.x -
                                    firstInvader.position.x +
                                    lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            } else {
                                setTimeout(() => {
                                    grids.splice(gridIndex, 1);
                                }, 0);
                            }
                        }
                    });
                }
            });
        });
    });
    // Event keyboard down
    if (keys.left.pressed && player.position.x >= 0) {
        player.velocity.x -= 1;
        player.rotation = -0.15;
    } else if (
        keys.right.pressed &&
        player.position.x + player.width <= canvas.width
    ) {
        player.velocity.x += 1;
        player.rotation = 0.15;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }
    // create new grid with random time
    if (frames % randomInterval === 0) {
        randomInterval = Math.floor(Math.random() * 500) + 500;
        grids.push(new Grid());
    }
    // create new gift
    if (frames % (Math.floor(Math.random() * 400) + 400) === 0) {
        gifts.push(
            new Gift({
                position: {
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height - 300),
                },
                velocity: {
                    x: 0,
                    y: Math.random() * 5 + 5,
                },
            })
        );
    }
    frames++;
}
animate();
window.addEventListener("keydown", ({ key }) => {
    if (game.isOver) return;
    switch (key) {
        case "ArrowLeft":
            keys.left.pressed = true;
            break;
        case "ArrowRight":
            keys.right.pressed = true;
            break;
        case " ":
            // keys.hit.pressed = true;
            shootAudio.play();
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y,
                    },
                    velocity: {
                        x: 0,
                        y: -2,
                    },
                    gunPower: player.gunPower,
                })
            );
            break;
    }
});

window.addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "ArrowLeft":
            keys.left.pressed = false;
            break;
        case "ArrowRight":
            keys.right.pressed = false;
            break;
        case " ":
            // keys.hit.pressed = false;
            break;
    }
});
