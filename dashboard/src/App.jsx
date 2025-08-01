import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HeroSection from './components/HeroSection';
import CardSection from './components/CardSection';
import BetaInvite from './components/BetaInvite';
import Leaderboard from './components/LeaderBoard';
import Footer from './components/Footer';
import Access from './components/Access';
import {BackgroundBorder} from './components/Test'

const CLIENT_ID = '235236309403-plajivfjk6j9jl78qdujmi6hh89eh823.apps.googleusercontent.com';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <Router>
            <div className="bg-black text-white font-sans">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <HeroSection />
                      <BetaInvite />
                      <CardSection />
                      <Footer />
                      {/* <BackgroundBorder /> */}
                 
                    </>
                  }
                />
                <Route path="/access" element={<Access />} />
              </Routes>
            </div>
          </Router>
        </GoogleOAuthProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

export default App;