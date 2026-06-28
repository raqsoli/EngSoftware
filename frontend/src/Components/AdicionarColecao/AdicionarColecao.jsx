import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { salvarColecao } from "./colecaoFacade.js"; //voltou a usar o Facade
import "./AdicionarColecao.css";

export default function AdicionarColecao() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");

  const canSave = name.trim() !== "";

  // voltou a chamar o Facade (salvarColecao) em vez de
  // apiFetch direto. O componente continua sem saber que por trás
  // o Facade agora faz uma chamada real à API — exatamente o ganho
  // do padrão: a interface pública não mudou, só o que está por dentro.
  const handleSave = async () => {
    setNameError("");
    setServerError("");
    setSaving(true);

    const resultado = await salvarColecao({ name, description });

    setSaving(false);

    if (!resultado.success) {
      if (resultado.errors.name) setNameError(resultado.errors.name);
      if (resultado.errors.server) setServerError(resultado.errors.server);
      return;
    }

    setSaved(true);
    setTimeout(() => navigate(-1, { state: { newCollection: resultado.colecao } }), 800);
  };

  return (
    <div className="add-collection-page">

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

          <div className="add-collection-field">
            <label className="add-collection-label">Descrição</label>
            <textarea
              className="add-collection-textarea"
              placeholder="Descreva a coleção (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {serverError && <p className="add-collection-error">{serverError}</p>}

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

      {saved && (
        <div className="add-collection-success-toast">
          Coleção criada com sucesso!
        </div>
      )}

    </div>
  );
}
