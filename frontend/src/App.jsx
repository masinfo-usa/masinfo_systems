import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import ScrollToTop from './components/utils/ScrollToTop'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ProcessPage from './pages/ProcessPage'
import PortfolioPage from './pages/PortfolioPage'
import PricingPage from './pages/PricingPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin — no Header/Footer */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Public site */}
          <Route path="*" element={
            <div className="min-h-screen bg-bg text-text-primary overflow-x-hidden transition-colors duration-300">
              <Header />
              <main>
                <Routes>
                  <Route path="/"          element={<HomePage />} />
                  <Route path="/bc"        element={<HomePage />} />
                  <Route path="/process"   element={<ProcessPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/pricing"   element={<PricingPage />} />
                  <Route path="/contact"   element={<ContactPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
