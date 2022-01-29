extern crate regex;
use regex::Regex;

use std::io::prelude::*;
use std::fs::File;
use std::collections::HashMap;

pub fn parse_args() -> Result<HashMap<String, String>, String> {
    let args: Vec<String> = std::env::args().collect();
    let mut res: HashMap<String, String> = HashMap::new();
    for (i, v) in args.iter().enumerate() {
        match v.as_str() {
            "-h" | "--host" => {
                res.entry(String::from("ip")).or_insert(args[i+1].to_string());
            },
            "-p" | "--port" => {
                res.entry(String::from("port")).or_insert(args[i+1].to_string());
            },
            "-t" | "--threads" | "--threadcount" => {
                res.entry(String::from("threadcount")).or_insert(args[i+1].to_string());
            },
            _ => (),
        }   
    }
    match res.get("ip") {
        Some(_) => (),
        None => return Err("No host specified".to_string()),
    }
    match res.get("port") {
        Some(_) => (),
        None => return Err("No port specified".to_string()),
    }
    match res.get("threadcount") {
        Some(_) => (),
        None => return Err("No threadcount specified".to_string()),
    }
    Ok(res)
}

pub fn parse_request(buffer: &[u8]) -> Result<HashMap<String, String>, String> {
    let bufferstring = String::from_utf8_lossy(buffer);
    let mut hashmap: HashMap<String, String> = HashMap::new();
    if bufferstring.contains("GET") {
        hashmap.insert("method".to_string(), "GET".to_string());
    } else if bufferstring.contains("POST") {
        hashmap.insert("method".to_string(), "POST".to_string());
    } else {
        return Err("Unsupported request method".to_string());
    }

    match Regex::new("/.* ").unwrap().captures(&bufferstring.split("HTTP").nth(0).unwrap()) {
        Some(c) => {
            let capture = c.get(0).unwrap().as_str();
            let mut capture = capture.replace(" ", "");
            match capture.split("?").nth(1) {
                Some(m) => {
                    hashmap.insert("data".to_string(), (&m).to_string());
                    println!("{}", m);
                    capture = capture.replace(format!("?{}",m).as_str(), "");
                }
                None => (),
            }
            hashmap.insert("URI".to_string(), capture.to_string());
            if capture == "/" {
                hashmap.insert("URI".to_string(), "/index.html".to_string());
            }
        }
        None => {
            return Err("Could not find URI".to_string());
        }
    }

    Ok(hashmap)
}

pub fn get_file(filename: &str) -> Result<String, String> {
    let mut contents = String::new();
    match File::open(format!("webfiles/{}", filename)) {
        Ok(mut f) => {
            f.read_to_string(&mut contents).unwrap();
        }
        Err(_) => {
            return Err("Could not find file".to_string());
        },
    }
    let contentstwo = contents.clone();
    match Regex::new("\\{\\{.*\\}\\}").unwrap().captures(&contentstwo) {
        Some(a) => {
            for capture in a.iter() {
                let mut cap = capture.unwrap().as_str().replace("{{ ", "");
                cap = cap.replace(" }}", "");
                contents = contents.replace(capture.unwrap().as_str(), match get_file(cap.as_str()) {
                    Ok(s) => s,
                    Err(..) => {
                        return Err("Could not find file specified inside file".to_string());
                    }
                }.as_str())
            }
        }
        None => (),
    }
    //println!("{}", contents.as_str());
    Ok(contents)
}
