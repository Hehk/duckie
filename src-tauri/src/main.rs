// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[derive(serde::Serialize)]
struct ChatResponse {
    content: String,
}
#[tauri::command]
fn chat(content: &str) -> ChatResponse {
    let response = match content {
        "hello" => "Hello, how are you?",
        "good" => "That's good to hear!",
        _ => "I don't understand",
    };
    ChatResponse {
        content: response.to_string(),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![chat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
