FROM ubuntu

MAINTAINER Midas van Veen

RUN apt-get update && apt-get install curl git python3 python3-pip build-essential -y 
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > rustup.sh && sh rustup.sh -y 
#RUN git clone https://github.com/MidasVanVeen/tcpwebserver && cd tcpwebserver && ~/.cargo/bin/cargo build --release && chmod +x start.sh 
COPY . tcpwebserver/
RUN cd /tcpwebserver && ~/.cargo/bin/cargo build --release && chmod +x start.sh 
RUN cd / && git clone https://github.com/MidasVanVeen/tictactoe_gameserver && git clone https://github.com/MidasVanVeen/highscores_recorder 
RUN cd /tictactoe_gameserver && pip3 install -r requirements.txt && cd /highscores_recorder && pip3 install -r requirements.txt  

EXPOSE 80 4444 7777

CMD /tcpwebserver/start.sh

