import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { salvarColecao } from "./colecaoFacade.js";
import "./AdicionarColecao.css";

export default function AdicionarColecao() {
  const navigate = useNavigate();
  const location = useLocation();

  // Campos da coleção
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Lista de itens adicionados à coleção
  // Quando o usuário volta de AdicionarItem, o novo item chega via location.state
  const [items, setItems] = useState([]);

  // Feedback
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Erros — vindos do Facade
  const [nameError, setNameError] = useState("");

  // Quando o usuário volta de AdicionarItem com um novo item,
  // adiciona ele na lista sem duplicar
  useEffect(() => {
    const newItem = location.state?.newItem;
    if (newItem) {
      setItems((prev) => {
        const jaExiste = prev.some((it) => it.id === newItem.id);
        if (jaExiste) return prev;
        return [...prev, newItem];
      });
      // Limpa o state para não re-adicionar se o usuário navegar de volta
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  // Botão salvar desabilitado até nome estar preenchido
  const canSave = name.trim() !== "";

  const handleSave = async () => {
    setNameError("");
    setSaving(true);

    // ── Chama o Facade ──────────────────────────────────────
    // O componente não sabe como validar ou montar o payload —
    // isso é responsabilidade do adicionarColecaoFacade.js
    const resultado = await salvarColecao({ name, description, items });

    setSaving(false);

    if (!resultado.success) {
      // Repassa os erros do Facade para os campos da tela
      if (resultado.errors.name) setNameError(resultado.errors.name);
      return;
    }

    // Sucesso — exibe feedback e volta para o perfil
    setSaved(true);
    // TODO: quando o back estiver pronto, passar a colecao criada via state
    // para o UserProfilePage atualizar a lista sem precisar recarregar:
    // navigate(-1, { state: { newColecao: resultado.colecao } });
    setTimeout(() => navigate(-1), 1500);
  };

  const handleRemoveItem = (itemId) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  return (
    <div className="add-collection-page">

      {/* Cabeçalho — mesmo padrão de EditarColecao */}
      <header className="add-collection-header">
        <button
          className="add-collection-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      <main className="add-collection-main">
        <h2 className="add-collection-title">Adicionar Coleção</h2>

        <div className="add-collection-card">

          {/* Campo Nome — obrigatório */}
          <div className="add-collection-field">
            <label className="add-collection-label">Nome</label>
            <input
              className={`add-collection-input${nameError ? " input-error" : ""}`}
              type="text"
              placeholder="Nome da coleção"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
            />
            {nameError && <p className="add-collection-error">{nameError}</p>}
          </div>

          {/* Campo Descrição — opcional */}
          <div className="add-collection-field">
            <label className="add-collection-label">Descrição</label>
            <textarea
              className="add-collection-textarea"
              placeholder="Descreva a coleção (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Itens adicionados à coleção */}
          <div className="add-collection-field">
            <label className="add-collection-label">Itens</label>

            <div className="add-collection-items-grid">
              {/* Itens já adicionados — vindos de AdicionarItem */}
              {items.map((item) => (
                <div key={item.id} className="add-collection-item-wrap">
                  <img
                    src={
                      Array.isArray(item.images) && item.images.length > 0
                        ? item.images[0]
                        : "https://placehold.co/80x80/fce4ec/c2185b?text=Item"
                    }
                    alt={item.name}
                  />
                  {/* Botão remover item da coleção */}
                  <button
                    className="add-collection-remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Remover item"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              ))}

              {/* Botão de adicionar item — navega para AdicionarItem */}
              {/* TODO: criar a rota /adicionar-item e linkar aqui */}
              <button
                className="add-collection-add-item-btn"
                onClick={() => navigate("/adicionar-item")}
                aria-label="Adicionar item"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="#aaa" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="add-collection-save-row">
            <button
              className="add-collection-save-btn"
              onClick={handleSave}
              disabled={!canSave || saving}
            >
              {saved ? "salvo!" : saving ? "salvando..." : "salvar"}
            </button>
          </div>

        </div>
      </main>

      {/* Toast de sucesso */}
      {saved && (
        <div className="add-collection-success-toast">
          Coleção criada com sucesso!
        </div>
      )}

    </div>
  );
}
