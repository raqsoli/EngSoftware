import { useNavigate } from "react-router-dom";
import "./Configuracoes.css";

export default function ConfiguracoesPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: quando o back estiver pronto, substituir por chamada à API:
    // fetch('url-da-api/logout', {
    //   method: 'POST',
    //   headers: { 'Authorization': 'Bearer ' + token }
    // })
    // .then(() => {
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   navigate('/');
    // })

    // Por enquanto, simula o logout direto no front
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="settings-page">

      {/* Cabeçalho com ícone de engrenagem */}
      <header className="settings-header">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </header>

      {/* Lista vertical de opções */}
      <main className="settings-list">

        <button
          className="settings-item"
          onClick={() => navigate("/editar-perfil")}
        >
          Editar Conta
        </button>

        <button
          className="settings-item"
          onClick={() => navigate("/excluir-conta")}
        >
          Excluir Conta
        </button>

        <button
          className="settings-item settings-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </main>
    </div>
  );
}
