import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Tooltip from '@radix-ui/react-tooltip'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tooltip.Provider delayDuration={300}>
      <App />
    </Tooltip.Provider>
  </StrictMode>,
)