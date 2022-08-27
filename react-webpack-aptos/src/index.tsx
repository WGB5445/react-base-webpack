import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

declare global {
  interface Window {
    martian: any
  }
}

function getState(account:string , martian:boolean){
  if(martian){
    return  account?account:'Connect Wallet'
  }else{
    return 'install Wallet'
  }
}

function App(){
  const [martian,setMartian] = useState(false)
  const [account,setAccount] = useState('')
  const [networkId,setNetworkId] = useState(0)
  

  useEffect(()=>{
    if(window.martian){
      setMartian(true);

      (async ()=> {
        const chainid = await window.martian.getChainId()
        setNetworkId(chainid.chainId)
      })()
    }
  },[])
  return(
    <div>
      <h1> My React and TypeScript aptos martian App!</h1>
      <button onClick={async ()=>{
        if(martian){
          const connect = await window.martian.connect();
          setAccount(connect.address)
        }else{
          window.open("https://www.martianwallet.xyz/", "_blank");
        }
      }}>{
        getState(account,martian)
      }</button>
      <p/>
      <a>{"Network id : " + (networkId != 0 ? networkId.toString() : '')}</a>
      <p/>
      <a></a>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <App />
)