const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext('2d')
const BLOCKSIZE = 400/3

var connection = new WebSocket('ws://127.0.0.1:4444',[])
var name, roomcode, grid, turn, winner, winarr

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

function start() {
	document.getElementById("form").style.display = "none"
	name = document.getElementById("name_input").value
	roomcode = document.getElementById("roomcode_input").value
	console.log("hello")
	connection.send("join," + roomcode + "," + name)
	setInterval(() => {
		connection.send("get," + roomcode)
		draw()
		if (winner) {
			new Promise(r => setTimeout(r, 2000)).then(()=> {
				location.reload()
			});
		}
	}, 1000/30);
}

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
			canvasContext.moveTo(400,400)
			canvasContext.lineTo(0,0)
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
	else if (turn) {
		document.getElementById("message").innerHTML = turn + " is nu aan de beurt"
	}
}

window.addEventListener('click', (e) => {
	if (e.button == 0) {
		console.log("clicked")
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
