import React from 'react';
import { DataProvider } from './context/DataContext';
import Dashboard from './pages/Dashboard';
import Chatbot from './chatbot/Chatbot';

function App() {
  return (
    <DataProvider>
      <div className="relative">
        <Dashboard />
        <Chatbot />
      </div>
    </DataProvider>
  );
}

export default App;
