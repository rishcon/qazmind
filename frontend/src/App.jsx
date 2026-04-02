import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useLanguageStore } from './store/languageStore'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Test from './pages/Test'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Podcasts from './pages/Podcasts'
import Flashcards from './pages/Flashcards'
import Tutor from './pages/Tutor'

function App() {
  const { language } = useLanguageStore()

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="test/:subjectId" element={<Test />} />
          <Route path="tutor/:subjectId" element={<Tutor />} />
          <Route path="results/:attemptId" element={<Results />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="podcasts" element={<Podcasts />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
