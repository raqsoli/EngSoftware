import { BrowserRouter } from 'react-router-dom'
import Login from './Components/Login/Login'

//Com a vinda do backend esse arquivo pode mudar com a implementação de rotas protegidas e token de autenticação

function App() {
  return (
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )
}

export default App
