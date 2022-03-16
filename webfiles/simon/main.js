// Author: Midas van Veen
// code voor een soort simon says game.

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
const canvasRect = canvas.getBoundingClientRect()

const knopPosities = [
	[
		[canvas.width/2 - 150, canvas.width/2 - 22],
		[canvas.height/2 - 150, canvas.height/2 - 22]
	],
	[
		[canvas.width/2 + 22, canvas.width/2 + 150],
		[canvas.height/2 - 150, canvas.height/2 - 22]
	],
	[
		[canvas.width/2 - 150, canvas.width/2 - 22],
		[canvas.height/2 + 22, canvas.height/2 + 150]
	],
	[
		[canvas.width/2 + 22, canvas.width/2 + 150],
		[canvas.height/2 + 22, canvas.height/2 + 150]
	]
]



var correcteKnoppen = []
var pointer = 0
var score = 1
var playerbeurt = false
var computerbeurt = true
var gameover = false
var name = ''

window.onload = draw()

function begin() {
	name = document.getElementById('name_input').value
	var i = setInterval(() => {	
		computerBeurt()
		ctx.fillStyle = "black"
		ctx.beginPath()
		ctx.arc(canvas.width/2,canvas.height/2,80,Math.PI*2, 0)
		ctx.fill()
		if (playerbeurt) {
			ctx.fillStyle = "limegreen"
		} else {
			ctx.fillStyle = "red"
		}
		ctx.fill()
	}, 1000/15)

}

function computerBeurt() {
	if (!computerbeurt) { return }
	index = Math.floor(Math.random() * 4 + 1)
	correcteKnoppen.push(index) // voeg een random nummer van 1 tot 4 toe aan correcteKnoppen 
	computerbeurt = false
	// een soort van makeshift for loop met een delay van 1 seconde
	activateButton(correcteKnoppen[0])
	var i = 1, id = setInterval(() => {
		if (!(i<score)) {
			clearInterval(id)
			playerbeurt = true
		} else {
			activateButton(correcteKnoppen[i])
			i++
		}
		console.log(correcteKnoppen)
	}, 1500);
}

function verstuurHighscore() {
	var conn = new WebSocket('ws://127.0.0.1:7777')
	conn.onopen = () => {
		conn.send(name + "," + score + ",simon")
		score = 1
	}
}

function drawButton(type, state) {
	switch (type) {
		case 1:
			ctx.strokeStyle = "darkgreen"
			ctx.fillStyle = ctx.strokeStyle
			if (state) {
				ctx.fillStyle = "limegreen"
			}
			ctx.beginPath()
			ctx.arc(canvas.width/2,canvas.height/2, 150, Math.PI + 0.15, 1.5 * Math.PI - 0.15, false)
			ctx.lineTo(canvas.width/2 - 22, canvas.height/2 - 130)
			ctx.arc(canvas.width/2,canvas.height/2, 100, Math.PI * 1.5 - 0.22, Math.PI + 0.22, true)
			ctx.lineTo(canvas.width/2 - 150, canvas.height/2 - 22)
			ctx.stroke()
			ctx.fill()
			break

		case 2:
			ctx.strokeStyle = "darkred"
			ctx.fillStyle = ctx.strokeStyle
			if (state) {
				ctx.fillStyle = "red"
			}
			ctx.beginPath()
			ctx.arc(canvas.width/2,canvas.height/2, 150, Math.PI*2 - 0.15, 1.5 * Math.PI + 0.15, true)
			ctx.lineTo(canvas.width/2 + 22, canvas.height/2 - 130)
			ctx.arc(canvas.width/2,canvas.height/2, 100, Math.PI * 1.5 + 0.22, Math.PI*2 - 0.22, false)
			ctx.lineTo(canvas.width/2 + 150, canvas.height/2 - 22)
			ctx.stroke()
			ctx.fill()
			break

		case 3:
			ctx.strokeStyle = "#a09801"
			ctx.fillStyle = ctx.strokeStyle
			if (state) {
				ctx.fillStyle = "yellow"
			}
			ctx.beginPath()
			ctx.arc(canvas.width/2,canvas.height/2, 150, Math.PI - 0.15, Math.PI/2 + 0.15, true)
			ctx.lineTo(canvas.width/2 - 22, canvas.height/2 + 130)
			ctx.arc(canvas.width/2,canvas.height/2, 100, Math.PI/2 + 0.22, Math.PI - 0.22, false)
			ctx.lineTo(canvas.width/2 - 150, canvas.height/2 + 22)
			ctx.stroke()
			ctx.fill()
			break

		case 4:
			ctx.strokeStyle = "darkblue"
			ctx.fillStyle = "darkblue"
			if (state) {
				ctx.fillStyle = "blue"
			}
			ctx.beginPath()
			ctx.arc(canvas.width/2,canvas.height/2, 150, Math.PI*2 + 0.15, Math.PI/2 - 0.15, false)
			ctx.lineTo(canvas.width/2 + 22, canvas.height/2 + 130)
			ctx.arc(canvas.width/2,canvas.height/2, 100, Math.PI/2 - 0.22, Math.PI*2 + 0.22, true)
			ctx.lineTo(canvas.width/2 + 150, canvas.height/2 + 22)
			ctx.stroke()
			ctx.fill()
			break

		default:
			break
	}
}

function draw() {
	//ctx.fillStyle = "white"
	//ctx.fillRect(0,0,canvas.width, canvas.height)

	ctx.beginPath()
	ctx.fillStyle = "black"
	ctx.arc(canvas.width/2,canvas.height/2,170,Math.PI*2, 0)
	ctx.fill()

	ctx.beginPath()
	ctx.fillStyle = "#181f53"
	ctx.arc(canvas.width/2,canvas.height/2,80,Math.PI*2, 0)
	ctx.fill()

	drawButton(1,false)
	drawButton(2,false)
	drawButton(3,false)
	drawButton(4,false)
}

function activateButton(index) {
	if (playerbeurt) {
		if (correcteKnoppen[pointer] == index) {
			pointer++
			if (correcteKnoppen.length == pointer) {
				pointer = 0
				score += 1
				setTimeout(() => {
					playerbeurt = false
					computerbeurt = true
				}, 3000);
			}
		} else {
			alert("GAMEOVER, score: " + score)
			verstuurHighscore();
			pointer = 0

			playerbeurt = false
			computerbeurt = true
			correcteKnoppen = []
		}
	}
	new Audio('sounds/' + index + '.mp3').play()
	drawButton(index,true)
	setTimeout(() => {
		drawButton(index,false)
	}, 1000);
}

window.addEventListener('click', (e) => {
	if (e.button == 0) {
		if (playerbeurt) {
			knopPosities.forEach(button => {
				mX = e.clientX - canvasRect.left
				mY = e.clientY - canvasRect.top
				if (mX > button[0][0] && mX < button[0][1] &&
					mY > button[1][0] && mY < button[1][1]) {
					activateButton(knopPosities.indexOf(button) + 1)
				}
			});
		}
	}
})

window.addEventListener('keydown', (e) => {
	if (playerbeurt) {
		activateButton(Number(e.key))
	}
})
