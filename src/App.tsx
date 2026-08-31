import { Routes, Route, useLocation } from 'react-router'
import { useEffect, lazy, Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'

const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Leadership = lazy(() => import('./pages/Leadership'))
const BrandStandards = lazy(() => import('./pages/BrandStandards'))
const Admin = lazy(() => import('./pages/Admin'))
const Login = lazy(() => import('./pages/Login'))
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))
import ChatWidget from './components/ChatWidget'
import FloatingActions from './components/FloatingActions'
import AuthGuard from './components/AuthGuard'
import SEO from './components/SEO'
import GlobalLoader from './components/GlobalLoader'
import InitialLoader from './components/InitialLoader'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Fade-in / fade-out wrapper for page transitions */
const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

export default function App() {
  const location = useLocation();
  const { pathname } = location;
  const isExcludedRoute = pathname.startsWith('/admin') || pathname === '/login';
  const isChatWidgetExcluded = isExcludedRoute || pathname === '/contact';

  const [appReady, setAppReady] = useState(false);

  // Show the intro loader only on the very first visit
  if (!appReady) {
    return <InitialLoader onComplete={() => setAppReady(true)} />;
  }

  return (
    <HelmetProvider>
      <SEO />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <ScrollToTop />
          <Suspense fallback={<GlobalLoader />}>
            <AnimatePresence mode="wait">
              <motion.div key={pathname} {...pageTransition}>
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  <Route path="/leadership" element={<Leadership />} />
                  <Route path="/brand-standards" element={<BrandStandards />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/complete-profile" element={<CompleteProfile />} />
                  <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
          {!isExcludedRoute && <FloatingActions />}
          {!isChatWidgetExcluded && <ChatWidget />}
        </motion.div>
    </HelmetProvider>
  )
}
