let snake
let w, h
let fruit
let gameOver = false
let wall = 18
let snakeSpeed = 8
let playing = false

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
        circle(this.x, this.y, snakeSpeed * 3)
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
        this.body = [[99, 100], [98, 100], [97, 100], [96, 100], [95, 100], [94, 100], [93, 100], [92, 100], [91, 100], [90, 100], [89, 100], [88, 100], [87, 100], [86, 100], [85, 100], [84, 100], [83, 100], [82, 100], [81, 100], [80, 100]]
        this.direction = 'right'
        this.points = 0
        this.alpha = 1.05
        this.highScore = getItem('highScore') ? getItem('highScore') : 0
    }
    async show() {
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
    checkBody() {
        this.body.forEach((part, index) => {
            if (index > 20) {
                let xMag = part[0] - this.pos.x
                let yMag = part[1] - this.pos.y
                let dist = sqrt((xMag) ** 2 + (yMag) ** 2)
                if (dist < 100) {
                    if (Math.abs(yMag) > Math.abs(xMag)) {
                        key = 'ArrowLeft'
                    } else {
                        key = 'ArrowUp'
                    }
                }
            }
        })
    }
    findFood(food) {
        this.checkBody()
        let xMag = food.x - this.pos.x
        let yMag = food.y - this.pos.y
        let xD = (xMag) ** 2
        let yD = (yMag) ** 2
        if (xD <= 50) {
            if (yMag > 0) {
                key = 'ArrowDown'
            } else {
                key = 'ArrowUp'
            }
        }
        if (yD <= 50) {
            if (xMag > 0) {
                key = 'ArrowRight'
            } else {
                key = 'ArrowLeft'
            }
        }
    }
    move() {
        this.pos.add(this.vel)
        this.body.forEach((seg) => {
            if (Math.round(seg[0]) === Math.round(this.pos.x) && Math.round(seg[1]) === Math.round(this.pos.y)) {
                gameOver = true
            }
        })
    }
    edges() {
        if (this.pos.x < 0) {
            this.pos.x = w
            //gameOver = true
            return 'left'
        }
        if (this.pos.x > w) {
            this.pos.x = 0
            //gameOver = true
            return 'right'
        }
        if (this.pos.y < 0) {
            this.pos.y = h
            //gameOver = true
            return 'top'
        }
        if (this.pos.y > h) {
            this.pos.y = 0
            //gameOver = true
            return 'bottom'
        }
        return false
    }
    eat(food) {
        let dist = sqrt((this.pos.x - food.x) ** 2 + (this.pos.y - food.y) ** 2)
        if (dist <= this.radius - 0.1) {
            food.eaten = true
            this.body.push([food.x, food.y])
            this.points += 100
            if (this.points % 400) {
                //this.velMag = this.velMag * this.alpha
            }
            food.digest()
            this.updateHighScore()
        }
    }
    updateHighScore() {
        if (this.points > this.highScore) {
            this.highScore = this.points
            storeItem('highScore', this.highScore)
        }
    }
    reset() {
        snakeSpeed = 3
        key = ''
        this.pos = createVector(100, 100)
        this.velMag = snakeSpeed
        this.xDir = this.velMag
        this.yDir = 0
        this.vel = createVector(this.xDir, this.yDir)
        this.body = [[99, 100], [98, 100], [97, 100], [96, 100], [95, 100], [94, 100], [93, 100], [92, 100], [91, 100], [90, 100], [89, 100], [88, 100], [87, 100], [86, 100], [85, 100], [84, 100], [83, 100], [82, 100], [81, 100], [80, 100]]
        this.direction = 'right'
        this.points = 0
        this.alpha = 1.05
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
    snake.findFood(fruit)
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