// Author: Metehan
// Code voor de snake game

// maak constanten aan voor interactie met het canvas
const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext('2d')

// Andere constanten
const FPS = 3

// de naam die de speler heeft ingevoerd voor het spelen (voor highscores)
var name, gameover, intervalid

// 'main' functie die word opgeroepen nadat er op de start knop gedrukt word
function start() {
	// haal de naam van de speler op 
    name = document.getElementById('name_input').value
    intervalid = setInterval(() => {
		// de main loop. dit draait elk frame
		update()
		draw()
	}, 1000/FPS)
}

// =======================================================================
// ==== Updating =========================================================
// =======================================================================

function update() {
	// clear het scherm
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
	// beweeg de slang
    snake.move()
	// check of de slang een appel eet
    eatApple()
	// check of de slang een muur aanraakt
    checkHit()
}

// check of de slang een appel eet
function eatApple() {
	// check of de positie van het hoofd van de slang gelijk is aan de positie van de appel 
    if(snake.tail[snake.tail.length - 1].x == apple.x &&
        snake.tail[snake.tail.length - 1].y == apple.y){
			// maak de staart van de slang groter en reset de appel
            snake.tail[snake.tail.length] = {x:apple.x, y:apple.y}
            apple = new Apple()
        }
}

function checkHit() {
	// hoofd van de slang
    let headTail = snake.tail[snake.tail.length -1]

	// check of de slang de muur aanraakt, zo ja call gameOver()
    if (headTail.x == - snake.size) {
		gameOver()
    } else if (headTail.x == canvas.width) {
		gameOver()
    } else if (headTail.y == - snake.size) {
		gameOver()
    } else if (headTail.y == canvas.height) {
		gameOver()
    }
}

// =======================================================================
// ==== drawing ==========================================================
// =======================================================================

function draw() {
    createRect(0,0,canvas.width, canvas.height, "green")
    createRect(0,0, canvas.width, canvas.height)

    for (let i = 0; i < snake.tail.length; i++){
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5,
            snake.size - 5, snake.size- 5, "#fc07b2")
    }

    canvasContext.font = "20px Arial"
    canvasContext.fillStyle = "white"
    canvasContext.fillText("Score: " + (snake.tail.length -1),canvas.width - 120, 18)
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color)
	if (gameover) {
		drawGameOver()
	}
}

function drawGameOver() {
    createRect(0,0,canvas.width, canvas.height, "white")
    canvasContext.font = "25px Arial"
    canvasContext.fillStyle = "black"
    canvasContext.fillText("Game Over",canvas.width / 4, canvas.height / 2)
}

function createRect(x,y,width, height,color) {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}


// =======================================================================
// ==== other functions ==================================================
// =======================================================================

function gameOver() {
	var connection = new WebSocket('ws://86.87.226.14:7777')
	connection.onopen = () => {
		connection.send(name + "," + snake.tail.length + ",snake")
	}
	gameover = true
	clearInterval(intervalid)
}


// =======================================================================
// ==== input listener ===================================================
// =======================================================================

window.addEventListener("keydown", (event) => {
    setTimeout(() => {
        if (event.keyCode == 37 && snake.rotateX != 1) {
            snake.rotateX = -1
            snake.rotateY = 0
        } else if (event.keyCode == 38 && snake.rotateY != 1) {
            snake.rotateX = 0
            snake.rotateY = -1
        } else if (event.keyCode == 39 && snake.rotateX != -1) {
            snake.rotateX = 1
            snake.rotateY = 0
        } else if (event.keyCode == 40 && snake.rotateY != -1) {
            snake.rotateX = 0
            snake.rotateY = 1
        }
    }, 1)
})

// =======================================================================
// ==== snake class ======================================================
// =======================================================================

class Snake {
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
        this.tail = [{x:this.x, y:this.y}]
        this.rotateX = 0
        this.rotateY = 1
    }

    move() {
        let newRect

        if (this.rotateX == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateX == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateY == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.rotateY == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }


        this.tail.shift()
        this.tail.push(newRect)
    }
}

// =======================================================================
// ==== apple class ======================================================
// =======================================================================

class Apple{
    constructor(){
        let isTouching = true
        while (isTouching) {
			isTouching = false
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
            
            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true
                }
            }

            this.size = snake.size
            this.color = "red"
        }
    }
}

// creating initial snake and apple
const snake = new Snake(20,20,20)
let apple = new Apple()
