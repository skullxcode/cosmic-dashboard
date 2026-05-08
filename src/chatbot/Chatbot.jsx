import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiTrash2 } from 'react-icons/fi';
import { useDashboardData } from '../context/DataContext';
import { askAI } from '../services/aiService';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { issData, newsData, astroData } = useDashboardData();

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cosmic_chat');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'assistant', content: 'Hello! I am your Cosmic Intelligence Assistant. Ask me about the ISS, astronauts, or latest space news.' }]);
    }
  }, []);

  // Save to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Keep last 30 messages
      const msgsToSave = messages.length > 30 ? messages.slice(messages.length - 30) : messages;
      localStorage.setItem('cosmic_chat', JSON.stringify(msgsToSave));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const clearChat = () => {
    const initMsg = [{ role: 'assistant', content: 'Chat history cleared. How can I assist you today?' }];
    setMessages(initMsg);
    localStorage.setItem('cosmic_chat', JSON.stringify(initMsg));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Prepare context data
      const contextData = {
        iss: {
          currentLat: issData.currentPosition?.lat,
          currentLng: issData.currentPosition?.lng,
          speed: issData.speed
        },
        astronauts: astroData.astros.map(a => a.name).join(', '),
        totalAstronauts: astroData.astros.length,
        news: newsData.news.map(n => n.title).join(' | ')
      };

      const response = await askAI(userMsg, contextData);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error communicating with the AI service. Please check the AI token or try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-neon-blue text-space-900 rounded-full shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center justify-center text-2xl z-50 hover:bg-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FiMessageSquare />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[350px] h-[500px] glass-panel z-50 flex flex-col overflow-hidden shadow-2xl border-neon-purple/30"
          >
            {/* Header */}
            <div className="bg-space-800 p-4 border-b border-white/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
                <h3 className="font-bold text-white tracking-wide">Cosmic AI</h3>
              </div>
              <div className="flex gap-3">
                <button onClick={clearChat} className="text-gray-400 hover:text-red-400 transition" title="Clear Chat">
                  <FiTrash2 />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-neon-blue text-space-900 rounded-tr-none' 
                      : 'bg-space-800 text-gray-200 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-space-800 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <motion.div className="w-2 h-2 bg-neon-purple rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-neon-purple rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-neon-purple rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-space-800 border-t border-white/10 flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about ISS or News..."
                className="flex-1 bg-space-900 text-white rounded-xl px-4 py-2 border border-white/10 focus:outline-none focus:border-neon-blue/50"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="bg-neon-purple text-white p-2 rounded-xl hover:bg-opacity-80 transition disabled:opacity-50"
              >
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
