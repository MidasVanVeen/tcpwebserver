extern crate tcpwebserver;
use tcpwebserver::threading::*;
use tcpwebserver::utils::*;
use tcpwebserver::logger::*;

use std::io::prelude::*;
use std::net::{TcpListener, TcpStream};
use std::collections::HashMap;

fn main() {
    let arguments = match parse_args() {
        Ok(h) => h,
        Err(s) => {
            eprintln!("The following error occured: {}", s);
            return; 
        }
    };

    let listener = match TcpListener::bind(format!("{}:{}", arguments.get("ip").unwrap(), arguments.get("port").unwrap())) {
        Ok(l) => l,
        Err(..) => {
            eprintln!("Error creating listener; aborting!");
            return;
        }
    };

    let pool = ThreadPool::new(arguments.get("threadcount").unwrap().parse::<usize>().unwrap());

    for stream in listener.incoming() {
        let stream = stream.expect("Could not read incoming streams from listener");
        // TODO: log connection
        pool.execute(|| match handle_connection(stream) {
            Ok(()) => (),
            Err(s) => {eprintln!("The following error occured: {}", s);},
        });
    }
}

fn handle_connection(mut stream: TcpStream) -> Result<(), String> {
    let mut buffer = [0; 512];
    match stream.read(&mut buffer) {
        Ok(..) => (),
        Err(..) => {return Err("Could not read from stream".to_string());},
    }
    let logfilename = create_logfile()?;
    log_request(&buffer, logfilename.as_str())?;
    let parsed_request = parse_request(&buffer)?;
    let response = get_response(parsed_request)?;

    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();

    Ok(())
}

fn get_response(hashmap: HashMap<String, String>) -> Result<String, String> {
    let mut response = String::new();
    let mut header = String::new();
    let htmlfile = match hashmap.get("URI") {
        Some(s) => {
            match get_file(s) {
                Ok(v) => {
                    header.push_str("HTTP/1.1 200 OK\r\n\r\n");
                    v
                },
                Err(..) => {
                    header.push_str("HTTP/1.1 404 Not Found\r\n\r\n");
                    "".to_string()           
                },
            }
        },
        None => {
            return Err("Could not find URI".to_string());
        }
    };
    response.push_str(header.as_str());
    response.push_str(htmlfile.as_str());
    Ok(response)
}
