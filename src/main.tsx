import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import LenisProvider from "@/providers/LenisProvider"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LenisProvider>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </LenisProvider>
  </BrowserRouter>
)
