// Author: Midas
// Code voor het loggen van requests en get data

extern crate uuid;
use uuid::Uuid;

use std::fs::File;
use std::fs;
use std::io::Write;
use std::str;
use chrono::Utc;

pub fn create_logfile() -> Result<String, String> {
    match fs::create_dir_all("logs/") {
        Ok(..) => (),
        Err(..) => {return Err("Could not create directory".to_string());}
    };
    let mut filename = String::from("logs/logfile_");
    filename.push_str(format!("{}",Uuid::new_v4()).as_str());
    filename.push_str(".log");
    println!("{}", filename);
    Ok(filename)
}

pub fn log_request(request: &[u8], filename: &str) -> Result<(), String> {
    let mut file = match File::create(filename) {
        Ok(f) => f,
        Err(..) => {return Err("Could not create logfile".to_string());}
    };
    match writeln!(&mut file, "[ time ]: {}", Utc::now()) {
        Ok(()) => (),
        Err(..) => {return Err("Could not write to logfile".to_string());}
    }
    match writeln!(&mut file, "--------[ request ]--------\n{}", str::from_utf8(request).unwrap()) {
        Ok(()) => (),
        Err(..) => {return Err("Could not write to logfile".to_string());}
    };
    Ok(())
}

pub fn log_data(data: &str, filename: &str) -> Result<(), String> {
    let mut file = match File::open(filename) {
        Ok(f) => f,
        Err(..) => {return Err("Could not open logfile".to_string());}
    };
    match writeln!(&mut file, "--------[ data ]-------\n{}", data) {
        Ok(()) => (),
        Err(..) => {return Err("Could not write to logfile".to_string());}
    };
    Ok(())
}

pub fn rm_logs() -> Result<(), String> {
    match fs::remove_dir_all("logs/") {
        Ok(..) => Ok(()),
        Err(..) => Err("Could not remove logs directory".to_string()),
    }
}
