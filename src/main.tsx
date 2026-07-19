import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { ThemeProvider } from './providers/theme-provider'
import { AdminAuthProvider } from './context/AdminAuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="ramsai-theme">
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
