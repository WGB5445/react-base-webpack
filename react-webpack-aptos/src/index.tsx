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

  const [martian_to_input,setMartian_to_Input] = useState('0xa832f4839c3565ec516f3cc401661aa3cfb310f68f28cf97d41ce0f09dfe2a3a');
  const [martian_amount_input,setMartian_amount_Input] = useState('1');
  
  const [aptos_to_input,setAptos_to_Input] = useState('0xa832f4839c3565ec516f3cc401661aa3cfb310f68f28cf97d41ce0f09dfe2a3a');
  const [aptos_amount_input,setApots_amount_Input] = useState('1');

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
      <div>
        <p/>
        <h2> Send Some Aptos Coin</h2>
        To:<input disabled={martian_account == ''} type='text' value={martian_to_input} onChange={(e)=>{
          setMartian_to_Input(e.target.value)
        }}></input>
        <p/>
        Amount:<input disabled={martian_account == ''} type='text' value={martian_amount_input} onChange={(e)=>{
          setMartian_amount_Input(e.target.value)
        }}></input>
        <p/>
        <button disabled={martian_account == ''} onClick={async ()=>{
          const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [martian_to_input, parseInt(martian_amount_input)]
          };
          const transaction = await window.martian.generateTransaction(martian_account, payload);
          
          await window.martian.signAndSubmitTransaction(transaction);
        }}> Send Aptos Coin</button>
      </div>

      <h1> My React and TypeScript aptos Petra App!</h1>
      <button onClick={async ()=>{
        if(aptos){
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
      <div>
        <p/>
        <h2> Petra Send Some Aptos Coin</h2>
        To:<input disabled={aptos_account == ''} type='text' value={aptos_to_input} onChange={(e)=>{
          setAptos_to_Input(e.target.value)
        }}></input>
        <p/>
        Amount:<input disabled={aptos_account == ''} type='text' value={aptos_amount_input} onChange={(e)=>{
          setApots_amount_Input(e.target.value)
        }}></input>
        <p/>
        <button disabled={aptos_account == ''} onClick={async ()=>{
          const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [aptos_to_input, aptos_amount_input]
          };
          const res = await window.aptos.signAndSubmitTransaction(payload);
          if(res.code){
            alert(res.message)
          }
        }}> Send Aptos Coin</button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <App />
)