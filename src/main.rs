// Author: Midas
// Main code voor de webserver

extern crate tcpwebserver;
use tcpwebserver::logger::*;
use tcpwebserver::threading::*; // Vrijwel compleet gekopieerd van het boek "the rust programming language"
use tcpwebserver::utils::*;

use std::collections::HashMap;
use std::io::prelude::*;
use std::net::{TcpListener, TcpStream};

fn main() {
    let arguments = match parse_args() {
        Ok(h) => h,
        Err(s) => {
            eprintln!("The following error occured: {}", s);
            return;
        }
    };

    let listener = match TcpListener::bind(format!(
        "{}:{}",
        arguments.get("ip").unwrap(),
        arguments.get("port").unwrap()
    )) {
        Ok(l) => l,
        Err(..) => {
            eprintln!("Error creating listener; aborting!");
            return;
        }
    };

    let pool = ThreadPool::new(
        arguments
            .get("threadcount")
            .unwrap()
            .parse::<usize>()
            .unwrap(),
    );

    for stream in listener.incoming() {
        let stream = stream.expect("Could not read incoming streams from listener");
        pool.execute(|| match handle_connection(stream) {
            Ok(()) => (),
            Err(s) => {
                eprintln!("The following error occured: {}", s);
            }
        });
    }
}

fn handle_connection(mut stream: TcpStream) -> Result<(), String> {
    let mut buffer = [0; 1024];
    match stream.read(&mut buffer) {
        Ok(..) => (),
        Err(..) => {
            return Err("Could not read from stream".to_string());
        }
    }

    let parsed_request = parse_request(&buffer)?;
    let response = get_response(parsed_request)?;
    let logfilename = create_logfile()?;
    log_request(&buffer, logfilename.as_str())?;

    stream.write(&response).unwrap();
    stream.flush().unwrap();

    Ok(())
}

#[allow(unused_assignments)]
fn get_response(hashmap: HashMap<String, String>) -> Result<Vec<u8>, String> {
    let mut response = Vec::new();
    let mut header = Vec::new();
    let file: Vec<u8> = match hashmap.get("URI") {
        Some(s) => match get_file(s, hashmap.get("data").unwrap_or(&"".to_string())) {
            Ok(b) => {
                header = "HTTP/1.1 200 OK\r\n\r\n".as_bytes().to_vec();
                b
            }
            Err(..) => {
                header = "HTTP/1.1 404 Not Found\r\n\r\n".as_bytes().to_vec();
                "".as_bytes().to_vec()
            }
        },
        None => {
            return Err("Could not find URI".to_string());
        }
    };
    response.extend(header.iter().cloned());
    response.extend(file.iter().cloned());
    Ok(response)
}
