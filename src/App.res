open React

%%raw(`import "./app.css";`)

type message = {
  id: int,
  content: string,
  sender: string,
}

@react.component
let make = () => {
  let (messages, setMessages) = useState(() => [])
  let (input, setInput) = useState(() => "")
  Js.Console.log2("messages", messages)

  let addMessage = (content, sender) => {
    setMessages(prevMessages => {
      let id = prevMessages->Belt.Array.length
      let newMessage = {id, content, sender}
      Belt.Array.concat(prevMessages, [newMessage])
    })
  }

  let onInputChange = (e: ReactEvent.Form.t) => {
    setInput(ReactEvent.Form.currentTarget(e)["value"])
  }

  let onSubmit = (e: ReactEvent.Form.t) => {
    ReactEvent.Form.preventDefault(e)
    if input != "" {
      addMessage(input, "user")
      setInput(_old => "")

      // Add a response after a short delay (simulate chatbot)
      Js.Global.setTimeout(() => {
        addMessage("This is a simulated response.", "bot")
      }, 1000) |> ignore
    }
  }

  <div className="chat-container">
    <div className="messages">
      {messages
      ->Belt.Array.map(message =>
        <div key={string_of_int(message.id)} className={message.sender}>
          {React.string(message.content)}
        </div>
      )
      ->React.array}
    </div>
    <div className="input-container">
      <form onSubmit>
        <input
          className="chat-input"
          value=input
          onChange=onInputChange
          placeholder="Type your message..."
        />
        <button className="send-button" type_="submit"> {React.string("Send")} </button>
      </form>
    </div>
  </div>
}
