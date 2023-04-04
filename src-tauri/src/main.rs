// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::str;

#[tauri::command]
async fn run_eslint(path: String) -> Result<String, String> {
    println!("Run eslint against: {}", path);

    let mut cmd = Command::new("eslint");
    cmd.arg("--format=json .");
    cmd.current_dir(path);

    let output = cmd.output().expect("Failed to execute the command");
    if output.status.success() {
        let output_str = str::from_utf8(&output.stdout).expect("Output contains invalid UTF-8");

        println!("Output: {}", output_str);
        Ok(output_str.to_string())
    } else {
        let stdout = str::from_utf8(&output.stdout).expect("Output contains invalid UTF-8");
        eprintln!("Stdout: {}", stdout);
        let stderr = str::from_utf8(&output.stderr).expect("Output contains invalid UTF-8");
        Err(stderr)?
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_eslint])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // let llama_context = llama::llama_init_from_file();
    // println!("LLAMA Context {:?}", llama_context)
}
