import { useState } from 'react'
import './App.css'
import ModalTestPage from './pages/ModalTestPage'
import ApiTestPage from './pages/ApiTestPage'

type Page = 'modal' | 'api'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('modal')

  const navButtonStyle = (page: Page) => ({
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: currentPage === page ? '#ffffff' : '#4b5563',
    backgroundColor: currentPage === page ? '#2563eb' : '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  return (
    <div>
      {/* Navigation Bar */}
      <nav
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0, marginRight: '24px', fontSize: '18px' }}>
          Test Pages
        </h2>
        <button
          onClick={() => setCurrentPage('modal')}
          style={navButtonStyle('modal')}
          onMouseEnter={(e) => {
            if (currentPage !== 'modal') {
              e.currentTarget.style.backgroundColor = '#e5e7eb'
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 'modal') {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
            }
          }}
        >
          Modal Test
        </button>
        <button
          onClick={() => setCurrentPage('api')}
          style={navButtonStyle('api')}
          onMouseEnter={(e) => {
            if (currentPage !== 'api') {
              e.currentTarget.style.backgroundColor = '#e5e7eb'
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 'api') {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
            }
          }}
        >
          API Test
        </button>
      </nav>

      {/* Page Content */}
      <div>
        {currentPage === 'modal' && <ModalTestPage />}
        {currentPage === 'api' && <ApiTestPage />}
      </div>
    </div>
  )
}

export default App
