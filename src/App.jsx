import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Components/Login/Login'
import CadastroUsuario from './Components/CadastroUsuario/CadastroUsuario'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/home" element={<div>Home (em breve)</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App