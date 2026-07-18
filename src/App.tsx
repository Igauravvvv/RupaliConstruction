import { Routes, Route, useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Contact from './pages/Contact'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Leadership from './pages/Leadership'
import BrandStandards from './pages/BrandStandards'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ChatWidget from './components/ChatWidget'
import FloatingActions from './components/FloatingActions'
import SplashScreen from './components/SplashScreen'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if we've already shown the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    return !hasSeenSplash;
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/brand-standards" element={<BrandStandards />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingActions />
          <ChatWidget />
        </motion.div>
      )}
    </>
  )
}
