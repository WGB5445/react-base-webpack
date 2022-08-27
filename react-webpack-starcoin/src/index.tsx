import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import StarMaskOnboarding from '@starcoin/starmask-onboarding'

declare global {
  interface Window {
    starcoin: any
  }
}


function getState(account:string , starmask:boolean){
  if(starmask){
    return  account?account:'Connect Wallet'
  }else{
    return 'install Wallet'
  }
}

function App(){
  const [starmask,setStarmask] = useState(false)
  const [account,setAccount] = useState('')
  const [networkId,setNetworkId] = useState(0)
  

  useEffect(()=>{
    if(window.starcoin){
      setStarmask(true);

      (async ()=> {
        const chainInfo = await window.starcoin.request({
          method: 'chain.id',
        });
        setNetworkId(chainInfo.id)
      })()


      window.starcoin.on('chainChanged', (chain:string)=>{
        setNetworkId(parseInt(chain,16))
      })
      window.starcoin.on('accountsChanged', (new_account:any)=>{
        setAccount(new_account)
      })
    }
  },[])
  return(
    <div>
      <h1> My React and TypeScript starcoin starmask App!</h1>
      <button onClick={async ()=>{
        if(starmask){
          setAccount(await window.starcoin.request({
            method: 'stc_requestAccounts',
          }))
        }else{
          new StarMaskOnboarding().startOnboarding()
        }
      }}>{
        getState(account,starmask)
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