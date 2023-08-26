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
    constructor(radius, userSnake) {
        this.radius = radius
        this.userSnake = userSnake
        this.starting_y = Math.floor(Math.random() * w)
        this.starting_x = 99
        this.snake_key = key
        this.pos = createVector(this.starting_x, this.starting_y)
        this.velMag = snakeSpeed
        this.xDir = this.velMag
        this.yDir = 0
        this.vel = createVector(this.xDir, this.yDir)
        this.body = [[this.starting_x, this.starting_y], [98, this.starting_y], [97, this.starting_y], [96, this.starting_y], [95, this.starting_y], [94, this.starting_y], [93, this.starting_y], [92, this.starting_y], [91, this.starting_y], [90, this.starting_y], [89, this.starting_y], [88, this.starting_y], [87, this.starting_y], [86, this.starting_y], [85, this.starting_y], [84, this.starting_y], [83, this.starting_y], [82, this.starting_y], [81, this.starting_y], [80, this.starting_y]]
        this.direction = 'right'
        this.points = 0
        this.alpha = 1.05
        this.highScore = getItem('highScore') ?? 0
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
                        this.snake_key = 'ArrowLeft'
                    } else {
                        this.snake_key = 'ArrowUp'
                    }
                }
            }
        })
    }
    findFood(food) {
        if(this.userSnake) return
        this.checkBody()
        let xMag = food.x - this.pos.x
        let yMag = food.y - this.pos.y
        let xD = (xMag) ** 2
        let yD = (yMag) ** 2
        if (xD <= 50) {
            if (yMag > 0) {
                this.snake_key = 'ArrowDown'
            } else {
                this.snake_key = 'ArrowUp'
            }
        }
        if (yD <= 50) {
            if (xMag > 0) {
                this.snake_key = 'ArrowRight'
            } else {
                this.snake_key = 'ArrowLeft'
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
    changeDirection()
    {
        this.userSnake ? this.userChangeDirection() : this.autoChangeDirection()
    }
    userChangeDirection()
    {
    if (!this.edges()) {
        if (key === 'ArrowRight' && this.vel.x != -this.velMag) {
            this.xDir = this.velMag
            this.vel = createVector(this.xDir, 0)
            this.direction = 'right'
        }
        if (key === 'ArrowLeft' && this.vel.x != this.velMag) {
            this.xDir = -this.velMag
            this.vel = createVector(this.xDir, 0)
            this.direction = 'left'
        }
        if (key === 'ArrowUp' && this.vel.y != this.velMag) {
            this.yDir = -this.velMag
            this.vel = createVector(0, this.yDir)
            this.direction = 'up'
        }
        if (key === 'ArrowDown' && this.vel.y != -this.velMag) {
            this.yDir = this.velMag
            this.vel = createVector(0, this.yDir)
            this.direction = 'down'
        }
    }
    }
    autoChangeDirection()
    {
    if (!this.edges()) {
        if (this.snake_key === 'ArrowRight' && this.vel.x != -this.velMag) {
            this.xDir = this.velMag
            this.vel = createVector(this.xDir, 0)
            this.direction = 'right'
        }
        if (this.snake_key === 'ArrowLeft' && this.vel.x != this.velMag) {
            this.xDir = -this.velMag
            this.vel = createVector(this.xDir, 0)
            this.direction = 'left'
        }
        if (this.snake_key === 'ArrowUp' && this.vel.y != this.velMag) {
            this.yDir = -this.velMag
            this.vel = createVector(0, this.yDir)
            this.direction = 'up'
        }
        if (this.snake_key === 'ArrowDown' && this.vel.y != -this.velMag) {
            this.yDir = this.velMag
            this.vel = createVector(0, this.yDir)
            this.direction = 'down'
        }
    }
    }
    updateHighScore() {
        if (this.points > this.highScore) {
            this.highScore = this.points
            storeItem('highScore', this.highScore)
        }
    }
    reset() {
        snakeSpeed = 8
        this.snake_key = ''
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
    snake = new Snake(25, true)
    snake2 = new Snake(20, false)
}

function draw() {
    if (playing) {
        loop()
    }
    background(0)
    fruit.show()
    snake.show()
    snake2.show()
    if (gameOver) {
        StopGame()
    }

    // User snake
    snake.eat(fruit)
    snake.findFood(fruit)
    snake.move()
    snake.changeDirection()

    // Autosnakes
    snake2.eat(fruit)
    snake2.findFood(fruit)
    snake2.move()
    snake2.changeDirection()

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