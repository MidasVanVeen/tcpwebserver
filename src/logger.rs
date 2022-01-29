extern crate uuid;
use uuid::Uuid;

use std::fs::File;
use std::fs;
use std::io::Write;
use std::str;

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
    match writeln!(&mut file, "--------[ request ]--------\n{}", str::from_utf8(request).unwrap()) {
        Ok(()) => (),
        Err(..) => {return Err("Could not write to logfile".to_string());}
    };
    Ok(())
}
