import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const useLandingFooter = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      {useLandingFooter && <Footer />}
    </div>
  )
}
