import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/Login/Login.module.css'
import Login from './components/Login/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)