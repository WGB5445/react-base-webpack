import React from "react";
import ReactDOM from "react-dom/client";


function App(){
  return(
    <h1> My React and TypeScript App!</h1>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <App />
)