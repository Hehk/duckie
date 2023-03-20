// Tauri bindings

module API = {
  // ChatGPT did this, so idk if it is that great...

  @module("@tauri-apps/api/tauri") external uid: unit => int = "uid"

  @module("@tauri-apps/api/tauri")
  external transformCallback: (Js.Json.t => unit, bool) => int = "transformCallback"

  @module("@tauri-apps/api/tauri")
  external invoke: (string, ~args: 'a=?, unit) => Js.Promise.t<'b> = "invoke"

  @module("@tauri-apps/api/tauri")
  external convertFileSrc: (string, ~protocol: string=?, unit) => string = "convertFileSrc"

  // ReScript utility functions
  let invokeWithArgs = (cmd: string, args: 'a): Js.Promise.t<'b> => {
    invoke(cmd, ~args, ())
  }

  let invokeWithoutArgs = (cmd: string): Js.Promise.t<'b> => {
    invoke(cmd, ())
  }

  let convertFileSrcWithProtocol = (filePath: string, protocol: string): string => {
    convertFileSrc(filePath, ~protocol, ())
  }

  let convertFileSrcWithoutProtocol = (filePath: string): string => {
    convertFileSrc(filePath, ())
  }
}
