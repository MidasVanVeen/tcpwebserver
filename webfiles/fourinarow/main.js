const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const BLOCKSIZE = 15

//temp
const name = "temp"
const roomcode = 1

var connection = new Websocket("ws://127.0.0.1:8888")

connection.onmessage = () => {

}

var intervalID
window.onload = () => {
	connection.onopen = () => {
		connection.send("join," + name + "," + roomcode)
		console.log("joined game '" + roomcode + "' as " + name)
	}
	intervalID = setInterval(() => {
		update()
		draw()
	}, 1000/15);
}

function update() {
	connection.send("get," + roomcode)
}

window.addEventListener("click", (event) => {
	if (event.button == 0) {
		move(event.offsetX,event.offsetY)
	} 
})

function move(x,y) {
	for (let i = 0; i < 6; i++) {
		for (let n = 0; n < 7; n++) {
			if (y > i*BLOCKSIZE && y < i*BLOCKSIZE + BLOCKSIZE && x > n*BLOCKSIZE && x < n*BLOCKSIZE + BLOCKSIZE) {
				connection.send("move," + name + "," + roomcode)
				console.log("made a move")
			}
		}
	}
}
