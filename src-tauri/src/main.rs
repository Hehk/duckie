// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// TODO eventually setup some kind of config file
const SERVER_URL: &str = "https://f992-172-83-13-4.ngrok.io";

#[derive(serde::Serialize)]
struct ChatResponse {
    content: String,
}

#[derive(serde::Deserialize)]
struct ModelOutput {
    output: String,
}

// Temporary function to test the chat function
#[tauri::command]
async fn chat(content: &str) -> Result<ChatResponse, String> {
    Ok(ChatResponse {
        content: content.to_string(),
    })
}

// #[tauri::command]
// async fn chat(content: &str) -> Result<ChatResponse, String> {
//     let request_body = serde_json::json!({
//         "content": content,
//     });
//     let response = match reqwest::Client::new()
//         .post(format!("{}/chat", SERVER_URL))
//         .body(request_body.to_string())
//         .send()
//         .await
//     {
//         Ok(response) => {
//             let model_output = response.json::<ModelOutput>().await.unwrap();
//             model_output.output
//         }
//         Err(_) => "Error".to_string(),
//     };
//     Ok(ChatResponse {
//         content: response.to_string(),
//     })
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![chat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
