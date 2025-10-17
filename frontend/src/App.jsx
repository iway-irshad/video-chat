import { Route, Routes } from 'react-router';
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
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],

    queryFn: async () => {
      const response = await axiosInstance.get('/auth/check-auth');
      return response.data;
    }
  }); 
  console.log(data);
  return (
    <div className='h-screen flex flex-col' data-theme='light'>
      
      {/* Debug Info */}
      <div className='p-4 bg-blue-900 text-white'>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Error: {error ? error.message : 'None'}</p>
        <p>Data Items: {data ? data.length : 0}</p>
      </div>

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