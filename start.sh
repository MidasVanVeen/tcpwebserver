#!/bin/bash

set -m

cd /tcpwebserver && ./target/release/tcpwebserver -h 0.0.0.0 -p 80 -t 200 &

cd /tictactoe_gameserver && python3 main.py &
