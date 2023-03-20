%%raw(`import "./styles.css"`)

switch ReactDOM.querySelector("#root") {
| None => ()
| Some(element) =>
  ReactDOM.Client.createRoot(element)->ReactDOM.Client.Root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
