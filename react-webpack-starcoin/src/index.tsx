import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import StarMaskOnboarding from '@starcoin/starmask-onboarding'
import { bcs, providers, utils } from "@starcoin/starcoin";
import {BigNumber} from "bignumber.js"

declare global {
  interface Window {
    starcoin: any
  }
}

const nodeUrlMap = new Map([
  ['1','https://main-seed.starcoin.org'],
  ['251', 'https://barnard-seed.starcoin.org'],
  ['252', 'https://proxima-seed.starcoin.org'],
  ['253', 'https://halley-seed.starcoin.org'],
  ['254', 'http://localhost:9850']
])

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

  const [amount_input, setAmount_input] = useState('1')
  const [to_input,setTo_input] = useState('0x851abEF4eD79813D11BDA0Ca307bA021')
  

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
      <div>
        <p/>
        <h2> Starmask Send Some STC Token</h2>
        To:<input disabled={account == ''} type='text' value={to_input} onChange={(e)=>{
          setTo_input(e.target.value)
        }}></input>
        <p/>
        Amount:<input disabled={account == ''} type='text' value={amount_input} onChange={(e)=>{
          setAmount_input(e.target.value)
        }}></input>
        <p/>
        <button disabled={account == ''} onClick={async ()=>{
          const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber('1000000000')
          const sendAmountSTC = new BigNumber(amount_input)
          const sendAmountNanoSTC = sendAmountSTC.times(BIG_NUMBER_NANO_STC_MULTIPLIER)
          const functionId = '0x1::TransferScripts::peer_to_peer_v2';
          const typeArgs = ['0x1::STC::STC'];
          const args = [to_input,sendAmountNanoSTC];
          const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(functionId, typeArgs, args, nodeUrlMap.get(networkId.toString())||"");
          const provider = new providers.Web3Provider(window.starcoin, 'any')

          const payloadInHex = (function () {
            const se = new bcs.BcsSerializer()
            scriptFunction.serialize(se)
            return  '0x'+Buffer.from(se.getBytes()).toString('hex')
        })()
        const txParams = {
            data: payloadInHex,
        }
        const hash =  await provider.getSigner().sendUncheckedTransaction(txParams)
        console.log(hash)
        }}> Send STC Token</button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <App />
)