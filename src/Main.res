%%raw(`import "./styles.css"`)

switch ReactDOM.querySelector("#root") {
| None => ()
| Some(element) =>
  ReactDOM.Client.createRoot(element)->ReactDOM.Client.Root.render(
    <React.StrictMode>
      <div> {React.string("Hello World!")} </div>
    </React.StrictMode>,
  )
}
