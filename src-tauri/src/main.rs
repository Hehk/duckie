// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::*;
use std::collections::HashMap;
use std::fs::File;
use std::io::prelude::*;
use std::process::Command;

#[derive(Serialize)]
struct CommandOutput {
    stdout: EslintOutput,
    stderr: String,
    status: i32,
    files: HashMap<String, String>,
}

#[derive(Serialize, Deserialize)]
struct EslintFix {
    range: Vec<i32>,
    text: String,
}

#[derive(Serialize, Deserialize)]
struct EslintMessage {
    ruleId: Option<String>,
    severity: i32,
    message: String,
    line: Option<i32>,
    column: Option<i32>,
    nodeType: Option<String>,
    source: Option<String>,
    fix: Option<EslintFix>,
}

#[derive(Serialize, Deserialize)]
// #[serde(rename_all = "snake_case")]
struct EslintOutputItem {
    filePath: Option<String>,
    messages: Vec<EslintMessage>,
    errorCount: Option<i32>,
    warningCount: Option<i32>,
    fixableErrorCount: Option<i32>,
    fixableWarningCount: Option<i32>,
    source: String,
}

fn read_files(filenames: Vec<&str>) -> HashMap<String, String> {
    let mut contents: HashMap<String, String> = HashMap::new();

    for filename in filenames {
        let mut file = match File::open(filename) {
            Ok(file) => file,
            Err(_) => continue, // Skip files that can't be opened
        };

        let mut file_contents = String::new();
        if let Err(_) = file.read_to_string(&mut file_contents) {
            continue; // Skip files that can't be read
        }

        contents.insert(filename.to_string(), file_contents);
    }

    contents
}

type EslintOutput = Vec<EslintOutputItem>;

#[tauri::command]
async fn run_eslint(path: String) -> Result<CommandOutput, String> {
    println!("Run eslint against: {}", path);

    let eslint = format!("{}/node_modules/.bin/eslint", path);
    let mut cmd = Command::new(eslint);
    cmd.arg("--format=json").arg(".").current_dir(path);

    let output = cmd.output().expect("Failed to execute the command");
    let stdout = String::from_utf8(output.stdout).unwrap();
    let stdout = match serde_json::from_str::<EslintOutput>(&stdout) {
        Ok(v) => v,
        Err(e) => {
            println!("Error: {}", e);
            Vec::new()
        }
    };
    let files = read_files(
        stdout
            .iter()
            .filter_map(|item| item.filePath.as_ref().map(|s| s.as_str()))
            .collect(),
    );

    let command_output = CommandOutput {
        stdout,
        stderr: String::from_utf8(output.stderr).unwrap(),
        status: output.status.code().unwrap(),
        files,
    };
    Ok(command_output)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_eslint])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // let llama_context = llama::llama_init_from_file();
    // println!("LLAMA Context {:?}", llama_context)
}
