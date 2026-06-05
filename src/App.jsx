import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Components/Login/Login'
import CadastroUsuario from './Components/CadastroUsuario/CadastroUsuario'
import HomePage from './Components/HomePage/HomePage'
import ItemPage from './Components/ItemPage/ItemPage'
import UserProfilePage from './Components/UserProfilePage/UserProfilePage'
import EditarPerfil from './Components/EditarPerfil/EditarPerfil'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/perfil/:id" element={<UserProfilePage />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App