import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/instrument-serif/400-italic.css';
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import LenisProvider from "@/providers/LenisProvider"
import App from './App'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LenisProvider>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </LenisProvider>
  </BrowserRouter>
)
