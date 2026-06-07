import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditarColecao.css";

// ============================================================
// DADOS MOCKADOS — substituir quando o back estiver pronto
// TODO: remover mockCollection e substituir por chamada à API:
// const [collection, setCollection] = useState(null)
// useEffect(() => {
//   fetch('url-da-api/colecao/' + id)
//     .then(res => res.json())
//     .then(data => setCollection(data))
// }, [id])
// O back vai retornar: id, name, description, items
// ============================================================
const mockCollection = {
  id: 1,
  name: "Hello Kitty - McDonalds 2025",
  description: "",
  // TODO: items virão do back com os itens da coleção
  items: [
    { id: 1, image: "https://placehold.co/80x80/fce4ec/c2185b?text=HK+1" },
    { id: 2, image: "https://placehold.co/80x80/f8bbd0/ad1457?text=HK+2" },
    { id: 3, image: "https://placehold.co/80x80/f48fb1/880e4f?text=HK+3" },
  ],
};

export default function EditCollectionPage() {
  const navigate = useNavigate();
  // TODO: usar o id para buscar a coleção correta na API
  const { id } = useParams();

  // Estados dos campos
  // TODO: quando o back estiver pronto, iniciar com os dados reais da coleção
  const [name, setName] = useState(mockCollection.name);
  const [description, setDescription] = useState(mockCollection.description);

  // Estados de feedback
  const [nameSaved, setNameSaved] = useState(false);
  const [descriptionSaved, setDescriptionSaved] = useState(false);

  // Estado de erro — nome não pode ser vazio
  const [nameError, setNameError] = useState("");

  const handleSaveName = () => {
    setNameError("");

    if (name.trim() === "") {
      setNameError("O nome da coleção não pode ser vazio.");
      return;
    }

    // TODO: fetch('url-da-api/colecao/' + id + '/nome', { method: 'PUT', body: JSON.stringify({ name }) })
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleSaveDescription = () => {
    // descrição pode ser vazia — sem validação
    // TODO: fetch('url-da-api/colecao/' + id + '/descricao', { method: 'PUT', body: JSON.stringify({ description }) })
    setDescriptionSaved(true);
    setTimeout(() => setDescriptionSaved(false), 2000);
  };

  return (
    <div className="edit-collection-page">

      {/* Cabeçalho */}
      <header className="edit-collection-header">
        <button
          className="edit-collection-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Voltar para perfil"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      <main className="edit-collection-main">
        <h2 className="edit-collection-title">Editar Coleção</h2>

        <div className="edit-collection-card">

          {/* Campo Nome */}
          <div className="edit-collection-field">
            <label className="edit-collection-label">Nome</label>
            <input
              className={`edit-collection-input ${nameError ? "input-error" : ""}`}
              type="text"
              value={name}
              // TODO: valor inicial virá do back
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className="edit-collection-error">{nameError}</p>}
            <div className="edit-collection-save-row">
              <button className="edit-collection-save-btn" onClick={handleSaveName}>
                {nameSaved ? "salvo!" : "salvar"}
              </button>
            </div>
          </div>

          {/* Campo Descrição */}
          <div className="edit-collection-field">
            <label className="edit-collection-label">Descrição</label>
            <textarea
              className="edit-collection-textarea"
              value={description}
              // TODO: valor inicial virá do back
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="edit-collection-save-row">
              <button className="edit-collection-save-btn" onClick={handleSaveDescription}>
                {descriptionSaved ? "salvo!" : "salvar"}
              </button>
            </div>
          </div>

          {/* Itens da coleção */}
          <div className="edit-collection-field">
            <label className="edit-collection-label">Itens</label>
            <div className="edit-collection-items-grid">
              {/* TODO: trocar mockCollection.items por items vindo da API */}
              {mockCollection.items.map((item) => (
                <div key={item.id} className="edit-collection-item-wrap">
                  <img src={item.image} alt={`Item ${item.id}`} />
                  {/* TODO: botão de remover item da coleção — será implementado em outra issue */}
                  <button
                    className="edit-collection-remove-btn"
                    aria-label="Remover item"
                    disabled
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              ))}

              {/* Botão adicionar item — leva para página de criar item (ainda não implementada) */}
              {/* TODO: criar a página /adicionar-item e linkar aqui */}
              <div
                className="edit-collection-add-btn"
                onClick={() => navigate("/adicionar-item")}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
