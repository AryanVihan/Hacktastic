import React, { useContext } from 'react'
import "./App.css"
import va from "./assets/giphy.gif"
import { FaMicrophone } from "react-icons/fa6";
import { datacontext } from './context/usercontext';
import speakimg from "./assets/input.gif"
import aigif from "./assets/aiVoice.gif"
function App(){
  let {recognition,speaking,setSpeaking,prompt,response,setPrompt,setResponse}=useContext(datacontext)
  

  return (
    <div className='main'>
      <img src={va} alt="" id="BakaBot"/>
      <span>At your command, ready to assist!</span>
      {!speaking?
      <button onClick={()=>{
        setPrompt("listening...")
        setSpeaking(true)
        setResponse(false)
        recognition.start()
      }}>Click Here <FaMicrophone /></button>
    :
    <div className='response'>
      {!response?
      <img src={speakimg} alt="" id="speak" />
      :
      <img src={aigif} alt="" id="aigif" />}
      <p>{prompt}</p>
    </div>
    
    }

    </div>
  )
}

export default App