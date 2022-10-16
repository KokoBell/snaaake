let snake
let w, h
let fruit
let gameOver = false
let wall = 18
let snakeSpeed = 3
let playing = false

// Infinite walls
// Increase speed as your score gets higher
// Cool effects (tracers to the snake, or cool backgrounds like grass or flowers)

class Food {
    constructor() {
        this.x = random(wall, w - wall)
        this.y = random(wall, h - wall)
        this.eaten = false
    }
    show() {
        stroke('lime')
        fill('lime')
        circle(this.x, this.y, 10)
    }
    digest() {
        if (this.eaten) {
            this.x = random(wall, w - wall)
            this.y = random(wall, h - wall)
        }
        this.eaten = false
    }
}

class Snake {
    constructor(radius) {
        this.radius = radius
        this.pos = createVector(100, 100)
        this.velMag = snakeSpeed
        this.xDir = this.velMag
        this.yDir = 0
        this.vel = createVector(this.xDir, this.yDir)
        this.body = []
        this.direction = 'right'
        this.points = 0
        this.highScore = 0
    }
    show() {
        stroke('pink')
        fill('pink')
        circle(this.pos.x + 0, this.pos.y + 0, this.radius + 0)
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = this.body[i - 1]
        }
        if (this.body.length) {
            this.body[0] = [this.pos.x, this.pos.y]
        }
        if (this.body.length === 1) {
            let mag = 4
            if (this.direction == 'right') {
                this.body[0] = [this.pos.x + mag, this.pos.y]
            }
            if (this.direction == 'left') {
                this.body[0] = [this.pos.x - mag, this.pos.y]
            }
            if (this.direction == 'up') {
                this.body[0] = [this.pos.x, this.pos.y + mag]
            }
            if (this.direction == 'down') {
                this.body[0] = [this.pos.x, this.pos.y - mag]
            }
        }
        this.body.forEach((c) => {
            circle(c[0], c[1], this.radius)
        })
        strokeWeight(1)
    }
    move() {
        if (!this.edges()) {
            this.pos.add(this.vel)
        }
    }
    edges() {
        if (this.pos.x < 0) {
            gameOver = true
            return 'left'
        }
        if (this.pos.x > w) {
            gameOver = true
            return 'right'
        }
        if (this.pos.y < 0) {
            gameOver = true
            return 'top'
        }
        if (this.pos.y > h) {
            gameOver = true
            return 'bottom'
        }
        return false
    }
    eat(food) {
        let dist = sqrt((this.pos.x - food.x) ** 2 + (this.pos.y - food.y) ** 2)
        if (dist <= this.radius - 0.1) {
            let offset = 0
            if (this.direction == 'left') {
                offset = this.radius
            }
            if (this.direction == 'right') {
                offset = -this.radius
            }
            food.eaten = true
            this.body.push([food.x + offset, food.y])
            this.points += 100
            this.velMag = this.velMag * 1.05
        }
        food.digest()
        this.updateHighScore()
    }
    updateHighScore() {
        if (this.points > this.highScore) {
            this.highScore = this.points
        }
    }
    reset() {
        this.pos = createVector(100, 100)
        this.velMag = snakeSpeed
        this.xDir = this.velMag
        this.yDir = 0
        this.vel = createVector(this.xDir, this.yDir)
        this.body = []
        this.direction = 'right'
        this.points = 0
        key = ''
    }
}

function setup() {
    rectMode(CENTER)
    imageMode(CENTER)
    angleMode(DEGREES)
    w = windowWidth * 0.98
    h = windowHeight * 0.96
    createCanvas(w, h)
    fruit = new Food()
    loop()
    snake = new Snake(25, createVector(100, 100))
}

function draw() {
    if (playing) {
        loop()
    }
    background(0)
    fruit.show()
    snake.show()
    if (gameOver) {
        StopGame()
    }
    snake.eat(fruit)
    snake.move()
    fill('orange')
    stroke('orange')
    textSize(16)
    text('Points', w - 100, 25)
    textSize(24)
    text(snake.points, w - 100, 50)
    textSize(16)
    text('High Score', w - 200, 25)
    textSize(24)
    text(snake.highScore, w - 200, 50)
    changeDirection()
}

function StopGame() {
    stroke('blue')
    fill('blue')
    rect(w / 2, h / 2, 200, 100)
    stroke('lime')
    fill('lime')
    playButton = createButton('Play Again')
    playButton.position(w / 2 - 40, h / 2)
    playButton.mousePressed(() => {
        gameOver = false
        snake.reset()
        playButton.remove()
        loop()
    })
    noLoop()
}

function changeDirection() {
    if (!snake.edges()) {
        if (key === 'ArrowRight' && snake.vel.x != -snake.velMag) {
            snake.xDir = snake.velMag
            snake.vel = createVector(snake.xDir, 0)
            snake.direction = 'right'
        }
        if (key === 'ArrowLeft' && snake.vel.x != snake.velMag) {
            snake.xDir = -snake.velMag
            snake.vel = createVector(snake.xDir, 0)
            snake.direction = 'left'
        }
        if (key === 'ArrowUp' && snake.vel.y != snake.velMag) {
            snake.yDir = -snake.velMag
            snake.vel = createVector(0, snake.yDir)
            snake.direction = 'up'
        }
        if (key === 'ArrowDown' && snake.vel.y != -snake.velMag) {
            snake.yDir = snake.velMag
            snake.vel = createVector(0, snake.yDir)
            snake.direction = 'down'
        }
    }
}