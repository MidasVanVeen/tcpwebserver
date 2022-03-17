#!/bin/bash

set -m



cd /tictactoe_gameserver && python3 main.py &

cd /highscores_recorder && python3 main.py &

cd /tcpwebserver && ./target/release/tcpwebserver -h 0.0.0.0 -p 80 -t 200

fg %1
