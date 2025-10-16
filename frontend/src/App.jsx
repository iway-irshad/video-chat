import { Route, Routes } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';

const App = () => {
  console.log('App component rendering');
  
  return (
    <div className='h-screen flex flex-col' data-theme='forest'>
      <button className='btn bg-slate-200 text-yellow-700' onClick={() => toast.success('Toast created!')}>Create a toast</button>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;