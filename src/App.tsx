import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Adopt from './pages/Adopt'
import Learn from './pages/Learn'
import Volunteer from './pages/Volunteer'
import BunFest from './pages/BunFest'
import Give from './pages/Give'
import About from './pages/About'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/bunfest" element={<BunFest />} />
        <Route path="/give" element={<Give />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
