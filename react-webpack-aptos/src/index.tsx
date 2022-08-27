import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

declare global {
  interface Window {
    martian: any,
    aptos: any
  }
}

function getState(account:string , state:boolean){
  if(state){
    return  account?account:'Connect Wallet'
  }else{
    return 'install Wallet'
  }
}

function App(){
  const [martian,setMartian] = useState(false)
  const [aptos, setAptos] = useState(false)
  const [martian_account,setMartian_Account] = useState('')
  const [aptos_account,setAptos_Account] = useState('')
  const [aptos_network,setAptos_Network] = useState('')
  const [martian_networkId,setMartian_NetworkId] = useState(0)
  

  useEffect(()=>{
    if(window.martian){
      setMartian(true);

      (async ()=> {
        const chainid = await window.martian.getChainId()
        setMartian_NetworkId(chainid.chainId)
      })()
    }
    if(window.aptos){
      setAptos(true);

      (async ()=> {
        const network = await window.aptos.network()
        setAptos_Network(network)
      })()
    }
  },[])
  return(
    <div>
      <h1> My React and TypeScript aptos martian App!</h1>
      <button onClick={async ()=>{
        if(martian){
          const connect = await window.martian.connect();
          setMartian_Account(connect.address)
        }else{
          window.open("https://www.martianwallet.xyz/", "_blank");
        }
      }}>{
        getState(martian_account,martian)
      }</button>
      <p/>
      <a>{"Network id : " + (martian_networkId != 0 ? martian_networkId.toString() : '')}</a>
      <p/>
      <a></a>

      <h1> My React and TypeScript aptos Petra App!</h1>
      <button onClick={async ()=>{
        if(martian){
          const connect = await window.aptos.connect();
          setAptos_Account(connect.address)
        }else{
          window.open("https://github.com/aptos-labs/aptos-core/releases/tag/wallet-v0.1.7", "_blank");
        }
      }}>{
        getState(aptos_account,aptos)
      }</button>
      <p/>
      <a>{"Network id : " + (aptos_network ? aptos_network : '')}</a>
      <p/>
      <a></a>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <App />
)