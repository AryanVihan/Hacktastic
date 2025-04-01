import React, { useContext, useState, useEffect, useRef } from 'react'
import "./App.css"
import { FaMicrophone } from "react-icons/fa6";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import { datacontext } from './context/usercontext';
import speakimg from "./assets/input.gif"
import aigif from "./assets/aiVoice.gif"
import Spline from '@splinetool/react-spline';

function App(){
  let {recognition, speaking, setSpeaking, prompt, response, setPrompt, setResponse, takeCommand, speak} = useContext(datacontext)
  
  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [processingChat, setProcessingChat] = useState(false);
  const [lastUserCommand, setLastUserCommand] = useState('');
  
  // Ref for chat messages container to auto-scroll
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
  // Custom function to handle chat commands directly
  const handleChatCommand = (command) => {
    setLastUserCommand(command);
    
    // Handle common commands directly in the chat interface
    if(command.includes("open") && command.includes("youtube")){
      window.open("https://www.youtube.com/","_blank");
      addBotResponse("Opening YouTube...");
    } 
    else if (command.includes("open") && command.includes("exercises")) {
      window.open("http://localhost:8000/exercises.html", "_blank");
      addBotResponse("Opening Exercises...");
    }
    else if(command.includes("open") && command.includes("google")){
      window.open("https://www.google.com/","_blank");
      addBotResponse("Opening Google...");
    } 
    else if(command.includes("open") && command.includes("instagram")){
      window.open("https://www.instagram.com/","_blank");
      addBotResponse("Opening Instagram...");
    } 
    else if(command.includes("open") && command.includes("github")){
      window.open("https://github.com/vajeedashaik","_blank");
      addBotResponse("Opening GitHub...");
    }
    else if(command.includes("open") && command.includes("repository")){
      window.open("https://github.com/vajeedashaik?tab=repositories","_blank");
      addBotResponse("Opening your repositories...");
    }
    else if(command.includes("time")){
      const time = new Date().toLocaleString(undefined, {hour:"numeric", minute:"numeric"});
      addBotResponse(`The current time is ${time}`);
    }
    else if(command.includes("date")){
      const date = new Date().toLocaleString(undefined, {day:"numeric", month:"short"});
      addBotResponse(`Today's date is ${date}`);
    }
    else {
      // For other commands, use the AI response
      addBotResponse("Let me think about that...");
      
      // Also trigger the voice assistant's AI response mechanism
      // but don't activate speaking mode
      setTimeout(() => {
        // We'll use the original takeCommand but intercept the response
        const originalSetSpeaking = setSpeaking;
        const originalSpeak = speak;
        
        // Temporarily override speak function to capture response
        window.speechSynthesis.speak = (utterance) => {
          // Capture the text that would be spoken
          const responseText = utterance.text;
          // Add it to chat
          addBotResponse(responseText);
        };
        
        // Process with takeCommand but don't activate voice
        takeCommand(command);
        
        // Restore original functions after a delay
        setTimeout(() => {
          window.speechSynthesis.speak = originalSpeak;
        }, 1000);
      }, 500);
    }
  };
  
  // Helper function to add bot responses
  const addBotResponse = (text) => {
    setChatMessages(prev => [...prev.filter(msg => !msg.isTyping), { 
      sender: 'bot', 
      text: text
    }]);
    setProcessingChat(false);
  };
  
  const handleClick = () => {
    setPrompt("listening...")
    setSpeaking(true)
    setResponse(false)
    recognition.start()
  }
  
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Add user message to chat
    const userMessage = userInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setUserInput('');
    
    // Add "typing" indicator
    setChatMessages(prev => [...prev, { sender: 'bot', text: '...', isTyping: true }]);
    
    // Set processing flag
    setProcessingChat(true);
    
    // Process the command with our direct handler
    handleChatCommand(userMessage.toLowerCase());
  };

  return (
    <div className='main'>
      <div 
        style={{ 
          width: '775px', 
          height: '700px', 
          borderRadius: '25%', 
          overflow: 'hidden', 
          margin: '20px auto',
          border: '3px solid #30363d', 
          boxShadow: '0 0 30px rgba(149, 157, 165, 0.2)', 
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: 'rgba(13, 17, 23, 0.5)', 
          backdropFilter: 'blur(5px)'
        }}
        onClick={!speaking ? handleClick : undefined}
      >
        <div style={{ 
          position: 'absolute', 
          top: '0', 
          right: '5%', 
          width: '100%', 
          height: '100%',
          transform: 'scale(1)',
          transformOrigin: 'center center',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '0%'
        }}>
          <Spline 
            scene="https://prod.spline.design/Oq3wHaODbXYANxof/scene.splinecode"
            style={{
              borderRadius: '50%',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
        
        {speaking && (
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '0',
            right: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '15px',
            backgroundColor: 'rgba(22, 27, 34, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            margin: '0 auto',
            maxWidth: '80%',
            border: '1px solid #30363d'
          }}>
            <div style={{ marginBottom: '10px' }}>
              {!response ? (
                <img src={speakimg} alt="" id="speak" style={{ height: '60px' }} />
              ) : (
                <img src={aigif} alt="" id="aigif" style={{ height: '60px' }} />
              )}
            </div>
            <p style={{ 
              color: '#e6edf3', 
              fontSize: '16px', 
              margin: '0',
              textAlign: 'center',
              fontWeight: 'medium'
            }}>
              {prompt}
            </p>
          </div>
        )}
      </div>
      
      {/* Chatbot toggle button */}
      <div 
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#2ea043',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        {chatOpen ? <FaTimes size={24} color="white" /> : <FaRobot size={24} color="white" />}
      </div>
      
      {/* Chatbot window */}
      {chatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '350px',
          height: '500px',
          borderRadius: '12px',
          backgroundColor: 'rgba(22, 27, 34, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #30363d',
          zIndex: 999
        }}>
          {/* Chat header */}
          <div style={{
            padding: '15px',
            borderBottom: '1px solid #30363d',
            backgroundColor: 'rgba(36, 41, 47, 0.9)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FaRobot size={20} color="#58a6ff" style={{ marginRight: '10px' }} />
            <span style={{ color: 'white', fontWeight: 'bold' }}>AI Assistant</span>
          </div>
          
          {/* Chat messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {chatMessages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#2ea043' : '#30363d',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                  animation: msg.isTyping ? 'pulse 1s infinite' : 'none'
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <form 
            onSubmit={handleChatSubmit}
            style={{
              borderTop: '1px solid #30363d',
              padding: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(36, 41, 47, 0.8)'
            }}
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: '20px',
                border: '1px solid #30363d',
                backgroundColor: 'rgba(13, 17, 23, 0.8)',
                color: 'white',
                outline: 'none'
              }}
              disabled={processingChat}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#2ea043',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: processingChat ? 'not-allowed' : 'pointer',
                opacity: processingChat ? 0.7 : 1
              }}
              disabled={processingChat}
            >
              <FaPaperPlane color="white" size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App