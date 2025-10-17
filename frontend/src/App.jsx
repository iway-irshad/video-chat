import { Navigate, Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';

import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';

const App = () => {
  
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) return <PageLoader />;
  
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