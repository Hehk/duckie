type chatMessage = {content: string}

type chatResponse = {content: string}
@scope("JSON") @val
external parseIntoChatRespone: Js.Json.t => chatResponse = "parse"

let chat = async (str: string) => {
  let args = {
    "content": str,
  }
  let response: chatResponse = await Tauri.API.invokeWithArgs("chat", args)
  response
}
