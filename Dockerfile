FROM ubuntu

MAINTAINER Midas van Veen

RUN apt-get update && apt-get install curl -y && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > rustup.sh && sh rustup.sh -y && apt-get install git -y && git clone https://github.com/MidasVanVeen/tcpwebserver && cd tcpwebserver && ~/.cargo/bin/cargo build --release && cp target/release/tcpwebserver /usr/bin

EXPOSE 80

CMD ["/usr/bin/tcpwebserver","-p 80 -t 200 -h 0.0.0.0"]

