const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext('2d')

var connection = new WebSocket('ws://127.0.0.1:4444',['soap','rust-websocket']);

connection.onmessage = function(e){
   var server_message = e.data;
   console.log(server_message);
}

window.onload = () => {
	connection.onopen = () => {
		setInterval(() => {
			connection.send("alive")
		}, 1000/15);
	}
}

