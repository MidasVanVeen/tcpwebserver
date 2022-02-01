extern crate regex;

use regex::Regex;
use std::io::prelude::*;
use std::fs::File;
use std::collections::HashMap;
use crate::logger::{rm_logs};
use std::str;

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
            "--rm-logs" => {
                match rm_logs() {
                    Ok(()) => {println!("Removed logfiles!");},
                    Err(s) => {eprintln!("{}",s);},
                }
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

    match Regex::new(r"/.* ").unwrap().captures(&bufferstring.split("HTTP").nth(0).unwrap()) {
        Some(c) => {
            let capture = c.get(0).unwrap().as_str();
            let mut capture = capture.replace(" ", "");
            match capture.split("?").nth(1) {
                Some(m) => {
                    hashmap.insert("data".to_string(), (&m).to_string());
                    capture = capture.replace(format!("?{}",m).as_str(), "");
                }
                None => (),
            }
            hashmap.insert("URI".to_string(), capture.to_string());
            println!("{}", capture.to_string());
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

pub fn get_file(filename: &str, data: &str) -> Result<Vec<u8>, String> {
    let mut contents = Vec::new();
    match File::open(format!("webfiles/{}", filename)) {
        Ok(mut f) => {
            f.read_to_end(&mut contents).unwrap();
        }
        Err(_) => {
            return Err("Could not find file".to_string());
        },
    }
    if filename.split(".").nth(1).unwrap() == "html" {
        let mut result = String::from_utf8(contents).unwrap();
        for capture in Regex::new(r"\{\{.*\}\}").unwrap().find_iter(&result.clone()) {
            let mut cap = capture.as_str().replace("{{ ", "");
            cap = cap.replace(" }}", "");
            result = result.replace(capture.as_str(), str::from_utf8(&match get_file(cap.as_str(), data) {
                Ok(b) => b,
                Err(..) => Vec::new(),
            }).unwrap());
        }
        for capture in Regex::new(r"\[\[.*\]\]").unwrap().find_iter(&result.clone()) {
            let cap = capture.as_str().replace("[[ ", "").replace(" ]]", "");
            for e in data.split("&&") {
                let k = e.split("=").nth(0).unwrap_or("");
                let v = e.split("=").nth(1).unwrap_or("");
                if cap == k { 
                    println!("Im here");
                    result = result.replace(capture.as_str(), v);
                }
            }
        }
        contents = result.as_bytes().to_vec();
    }
    // println!("{}", String::from_utf8(contents.clone()).unwrap());
    Ok(contents)
}
