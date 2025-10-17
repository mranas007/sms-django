import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

function App() {

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">Welcome to the School Management System</h2>
        <p className="text-lg">Manage students, teachers, classes, and more with ease.</p>
      </main>
      <Footer />
    </>
  )
}

export default App
