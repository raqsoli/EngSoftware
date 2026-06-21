import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Components/Login/Login'
import CadastroUsuario from './Components/CadastroUsuario/CadastroUsuario'
import HomePage from './Components/HomePage/HomePage'
import ItemPage from './Components/ItemPage/ItemPage'
import UserProfilePage from './Components/UserProfilePage/UserProfilePage'
import EditarPerfil from './Components/EditarPerfil/EditarPerfil'
import EditarItem from './Components/EditarItem/EditarItem'
import EditarColecao from './Components/EditarColecao/EditarColecao'
import CollectionPage from './Components/ColectionPage/ColectionPage'
import PerfilOutroUsuario from './Components/PerfilOutroUsuario/PerfilOutroUsuario'
import Excluirconta from './Components/Excluirconta/Excluirconta'
import BuscaItemColecao from './Components/BuscaItemColecao/BuscaItemColecao'
import Configuracoes from './Components/Configuracoes/Configuracoes'

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
        <Route path="/editar-item/:id" element={<EditarItem />} />
        <Route path="/editar-colecao/:id" element={<EditarColecao />} />
        <Route path="/colecao/:id" element={<CollectionPage />} />
        <Route path="/perfil-usuario/:id" element={<PerfilOutroUsuario />} />
        <Route path="/excluir-conta" element={<Excluirconta />} />
        <Route path="/busca" element={<BuscaItemColecao />} />              
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App