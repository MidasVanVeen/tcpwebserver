const canvas = document.getElementById('canvas')
const canvasContext = canvas.getContext('2d')

// enkele constanten
const block_size = 30
const columns = 10;
const rows = 20;

// hier zet ik de breedte, hoogte en de schaal van het canvas
canvasContext.canvas.width = columns * block_size
canvasContext.canvas.height = rows * block_size
canvasContext.scale(block_size, block_size)

class Board {
	constructor(canvasContext) {
		this.canvasContext = canvasContext
		this.grid = this.getEmpty()
	}

	getEmpty() {
		return Array.from({length: rows}, () => Array(columns).fill(0))
	}
}

class Tetrimino {
	constructor(x,y,type) {
		this.matrix = this.getFromType(type);
	}

	getFromType(type) {
		let matrix;
		switch (type) {
			case 1:
				matrix = [
					[0,1,0,0],
					[0,1,0,0],
					[0,1,0,0],
					[0,1,0,0]
				]
				break;
			case 2:
				matrix = [
					[0,0,2],
					[0,0,2],
					[0,2,2],
				]
				break;
			case 3:
				matrix = [
					[0,3,0],
					[0,3,0],
					[0,3,3],
				]
				break;
			case 4:
				matrix = [
					[0,0,0],
					[0,4,4],
					[0,4,4],
				]
				break;
			case 5:
				matrix = [
					[5,0,0],
					[5,5,0],
					[0,5,0],
				]
				break;
			case 6:
				matrix = [
					[0,0,0],
					[6,6,6],
					[0,6,0],
				]
				break;
			case 7:
				matrix = [
					[0,0,7],
					[0,7,7],
					[0,7,0],
				]
				break;

			default:
				break;
		}
	}
}

// de eerste functie die opgeroepen word
function start() {
	board = new Board(canvasContext)
	console.table(board.grid)
}
