import Hero from './components/Hero'
import ValueTracks from './components/ValueTracks'
import Gate from './components/Gate'
import Trust from './components/Trust'
import Dashboard from './components/Dashboard'
import TypingModal from './components/TypingModal'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative">
      <Hero />
      <ValueTracks />
      <Gate />
      <Trust />
      <Dashboard />
      <TypingModal />
    </div>
  )
}

export default App
