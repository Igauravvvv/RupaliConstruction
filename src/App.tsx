import { Routes, Route, useLocation } from 'react-router'
import { useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
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
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isExcludedRoute = pathname.startsWith('/admin') || pathname === '/login';
  const isChatWidgetExcluded = isExcludedRoute || pathname === '/contact';

  return (
    <HelmetProvider>
      <SEO />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <ScrollToTop />
          <Suspense fallback={<GlobalLoader />}>
            <Routes>
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
          </Suspense>
          {!isExcludedRoute && <FloatingActions />}
          {!isChatWidgetExcluded && <ChatWidget />}
        </motion.div>
    </HelmetProvider>
  )
}
