import { Routes, Route, useLocation } from 'react-router'
import React, { Component, ReactNode, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'

const BuildingGuide = lazy(() => import('./pages/BuildingGuide'))
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Leadership = lazy(() => import('./pages/Leadership'))
const BrandStandards = lazy(() => import('./pages/BrandStandards'))
const Admin = lazy(() => import('./pages/Admin'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Login = lazy(() => import('./pages/Login'))
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'))
const Profile = lazy(() => import('./pages/Profile'))
const SitemapPage = lazy(() => import('./pages/SitemapPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ChatWidget = lazy(() => import('./components/ChatWidget'))
const FloatingActions = lazy(() => import('./components/FloatingActions'))
import AuthGuard from './components/AuthGuard'
import GlobalLoader from './components/GlobalLoader'

class RouteErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Route render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F5] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#071F3D] mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-sm max-w-md">We encountered an issue loading this section. Please refresh or return to the home page.</p>
          <a href="/" className="px-6 py-2.5 rounded-xl bg-[#0B2E59] text-white font-medium hover:bg-blue-900 transition-colors text-sm">Return Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
};

export default function App() {
  const location = useLocation();
  const { pathname } = location;
  const isExcludedRoute = pathname.startsWith('/admin') || pathname === '/login' || pathname === '/admin-login';
  const isHomePage = pathname === '/';

  return (
    <HelmetProvider>
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <ScrollToTop />
          <Suspense fallback={<GlobalLoader />}>
            <AnimatePresence mode="wait">
              <motion.div key={pathname} {...pageTransition}>
                <RouteErrorBoundary>
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/building-guide-gurgaon" element={<BuildingGuide />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:slug" element={<ServiceDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:slug" element={<ProjectDetail />} />
                    <Route path="/leadership" element={<Leadership />} />
                    <Route path="/brand-standards" element={<BrandStandards />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/sitemap" element={<SitemapPage />} />
                    <Route path="/site-map" element={<SitemapPage />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/complete-profile" element={<CompleteProfile />} />
                    <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </RouteErrorBoundary>
              </motion.div>
            </AnimatePresence>
            {!isExcludedRoute && <FloatingActions />}
            {isHomePage && <ChatWidget />}
          </Suspense>
        </motion.div>
    </HelmetProvider>
  )
}
