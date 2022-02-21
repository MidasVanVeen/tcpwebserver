// Author: Metehan (meeste) & Midas
// front-end code voor de online boter kaas en eieren game

// ======================================================
// ==== constanten ======================================
// ======================================================

const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext('2d')
const BLOCKSIZE = 400/3

// ======================================================
// ==== globale vars ====================================
// ======================================================

var connection = new WebSocket('ws://127.0.0.1:4444',[])
var name, roomcode, grid, turn, winner, winarr

// ======================================================
// ==== message handling ================================
// ======================================================

connection.onmessage = function(e){
   	var server_message = e.data
	array = JSON.parse(e.data)
	grid = array[1]
	turn = array[0]
	if (array[2][0]) {
		winner = array[2][1]
		winarr = array[2][2]
	} else {
		winner = false
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// ======================================================
// ==== main functie ====================================
// ======================================================

function start() {
	// ophalen van input 
	document.getElementById("form").style.display = "none"
	name = document.getElementById("name_input").value
	roomcode = document.getElementById("roomcode_input").value
	// joinen van een room
	connection.send("join," + roomcode + "," + name)
	// de main loop
	setInterval(() => {
		connection.send("get," + roomcode)
		draw()
		//if (winner) {
		//	grid = [[0,0,0],[0,0,0],[0,0,0]]
		//	winner = false
		//	winarr = []
		//	turn = ''
		//	start()
		//}
	}, 1000/30);
}

// ======================================================
// ==== drawing =========================================
// ======================================================

function draw() {
	canvasContext.clearRect(0,0,400,400)
	if (winner) {
		if (winarr[0] != 0) {
			canvasContext.beginPath()
			canvasContext.moveTo(0,(winarr[0]-1)*BLOCKSIZE + (BLOCKSIZE/2))
			canvasContext.lineTo(400,(winarr[0]-1)*BLOCKSIZE + (BLOCKSIZE/2))
			canvasContext.strokeStyle = "Black"
			canvasContext.stroke()
		}
		if (winarr[1] != 0) {
			canvasContext.beginPath()
			canvasContext.moveTo((winarr[1]-1)*BLOCKSIZE + (BLOCKSIZE/2),0)
			canvasContext.lineTo((winarr[1]-1)*BLOCKSIZE + (BLOCKSIZE/2),400)
			canvasContext.strokeStyle = "Black"
			canvasContext.stroke()
		}
		if (winarr[2] == 1) {
			canvasContext.beginPath()
			canvasContext.moveTo(0,0)
			canvasContext.lineTo(400,400)
			canvasContext.strokeStyle = "Black"
			canvasContext.stroke()
		}
		if (winarr[2] == 2) {
			canvasContext.beginPath()
			canvasContext.moveTo(400,0)
			canvasContext.lineTo(0,400)
			canvasContext.strokeStyle = "Black"
			canvasContext.stroke()
		}
		canvasContext.beginPath()
	}
	for (let i = 0; i < 3; i++) {
		for (let n = 0; n < 3; n++) {
			if (grid[i][n] == 'X') {
				// draw an x
				// canvasContext.fillStyle = "green"
				canvasContext.beginPath()
				canvasContext.moveTo(n*BLOCKSIZE + 25, i*BLOCKSIZE + 25)
				canvasContext.lineTo(n*BLOCKSIZE + (BLOCKSIZE - 25), i*BLOCKSIZE + (BLOCKSIZE - 25))
				canvasContext.moveTo(n*BLOCKSIZE + (BLOCKSIZE - 25), i*BLOCKSIZE + 25)
				canvasContext.lineTo(n*BLOCKSIZE + 25, i*BLOCKSIZE + (BLOCKSIZE - 25))
				canvasContext.strokeStyle = "Black"
				canvasContext.stroke()
			}
			else if (grid[i][n] == 'O') {
				// canvasContext.fillStyle = "red"
				canvasContext.beginPath()
				canvasContext.arc(n*BLOCKSIZE + (BLOCKSIZE/2), i*BLOCKSIZE + (BLOCKSIZE/2), (BLOCKSIZE/2) - 25, 0, 2 * Math.PI)
				canvasContext.strokeStyle = "Black"
				canvasContext.stroke()
			}
			else {
				// canvasContext.fillStyle = "black"
			}
			canvasContext.beginPath()
			canvasContext.rect(n*BLOCKSIZE,i*BLOCKSIZE,BLOCKSIZE,BLOCKSIZE)
			canvasContext.strokeStyle = "Black"
			canvasContext.stroke()
		}
	}
	if (winner) {
		document.getElementById("message").innerHTML = winner + " heeft gewonnen"
	}
	if (turn) {
		document.getElementById("message").innerHTML = turn + " is nu aan de beurt"
	}
}

// ======================================================
// ==== updating ========================================
// ======================================================

window.addEventListener('click', (e) => {
	if (e.button == 0) {
		move(e.offsetX, e.offsetY)
	}
})

function move(x, y) {
	for (let i = 0; i < 3; i++) {
		for (let n = 0; n < 3; n++) {
			if (y > i*BLOCKSIZE && y < (i+1)*BLOCKSIZE 
				&& x > n*BLOCKSIZE && x < (n+1)*BLOCKSIZE)
			{
				connection.send("move," + roomcode + "," + name + "," + n + "," + i)
				console.log("move," + roomcode + "," + name + "," + n + "," + i)
				console.log("sent")
			}
		}
	}
}

// ======================================================
// ==== other functions =================================
// ======================================================

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
