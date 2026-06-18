import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExcluirConta.css";

export default function ExcluirContaPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setPasswordError("");

    if (password.trim() === "") {
      setPasswordError("Digite sua senha para confirmar.");
      return;
    }

    setLoading(true);

    // TODO: quando o back estiver pronto, substituir por chamada à API:
    // fetch('url-da-api/usuario/excluir-conta', {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ password })
    // })
    // .then(res => {
    //   if (res.status === 401) {
    //     setLoading(false);
    //     setPasswordError("Senha incorreta.");
    //     return;
    //   }
    //   if (res.ok) {
    //     // Limpa credenciais salvas localmente
    //     localStorage.clear();
    //     sessionStorage.clear();
    //     setLoading(false);
    //     setSuccess(true);
    //     setTimeout(() => navigate("/"), 2000);
    //   }
    // })

    // Por enquanto, simula o retorno de sucesso do back
    setTimeout(() => {
      // Limpa credenciais salvas localmente
      localStorage.clear();
      sessionStorage.clear();
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    }, 1000);
  };

  return (
    <div className="delete-account-page">

      <header className="delete-account-header">
        <button
          className="delete-account-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="delete-account-title">Excluir Conta</h1>
      </header>

      <main className="delete-account-main">
        <div className="delete-account-card">

          {/* Ícone de aviso */}
          <div className="delete-account-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <p className="delete-account-info">
            Escreva sua senha para confirmar a exclusão.
          </p>

          <p className="delete-account-warning">
            Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos.
          </p>

          <div className="delete-account-field">
            <label className="delete-account-label">Senha</label>
            <input
              className={`delete-account-input ${passwordError ? "input-error" : ""}`}
              type="password"
              value={password}
              placeholder="Digite sua senha"
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.trim() !== "") setPasswordError("");
              }}
            />
            {passwordError && <p className="delete-account-error">{passwordError}</p>}
          </div>

          <div className="delete-account-actions">
            <button
              className="delete-account-cancel"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              cancelar
            </button>
            <button
              className="delete-account-confirm"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "excluindo..." : "excluir conta"}
            </button>
          </div>

        </div>
      </main>

      {/* Toast de sucesso */}
      {success && (
        <div className="delete-account-toast">
          Conta excluída com sucesso. Redirecionando...
        </div>
      )}

    </div>
  );
}
