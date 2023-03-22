import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <div className="bg-red-500 font-bold">Hello World!</div>
    </React.StrictMode>
  );
}