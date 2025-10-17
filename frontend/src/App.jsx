import { Navigate, Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';

import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from './lib/axios.js';

const App = () => {
  
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["authUser"],

    queryFn: async () => {
      const response = await axiosInstance.get('/auth/check-auth');
      return response.data;
    },
    retry: false, // auth check should not retry
  }); 

  const authUser = authData?.user;


  return (
    <div className='h-screen flex flex-col' data-theme='coffee'>

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notification" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />

    </div>
  );
};

export default App;