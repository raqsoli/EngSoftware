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
  items: [
    { id: 1, image: "https://placehold.co/80x80/fce4ec/c2185b?text=HK+1" },
    { id: 2, image: "https://placehold.co/80x80/f8bbd0/ad1457?text=HK+2" },
    { id: 3, image: "https://placehold.co/80x80/f48fb1/880e4f?text=HK+3" },
  ],
};

// TODO: substituir por verificação real com o token do usuário logado
// O back valida se a coleção pertence ao usuário — aqui simulamos que é dono
const mockIsOwner = true;

export default function EditCollectionPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState(mockCollection.name);
  const [description, setDescription] = useState(mockCollection.description);

  const [nameSaved, setNameSaved] = useState(false);
  const [descriptionSaved, setDescriptionSaved] = useState(false);

  const [nameError, setNameError] = useState("");

  // Estados do modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    // TODO: fetch('url-da-api/colecao/' + id + '/descricao', { method: 'PUT', body: JSON.stringify({ description }) })
    setDescriptionSaved(true);
    setTimeout(() => setDescriptionSaved(false), 2000);
  };

  const handleConfirmDelete = () => {
    setDeleteLoading(true);

    // TODO: quando o back estiver pronto, substituir por chamada à API:
    // fetch('url-da-api/colecao/' + id, { method: 'DELETE' })
    //   .then(res => {
    //     if (res.ok) {
    //       setDeleteLoading(false);
    //       setShowDeleteModal(false);
    //       setDeleteSuccess(true);
    //       setTimeout(() => navigate(-1), 2000);
    //     }
    //   })

    // Por enquanto, simula o retorno de sucesso do back
    setTimeout(() => {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setDeleteSuccess(true);
      setTimeout(() => navigate(-1), 2000);
    }, 1000);
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
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim() !== "") setNameError("");
              }}
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
              {mockCollection.items.map((item) => (
                <div key={item.id} className="edit-collection-item-wrap">
                  <img src={item.image} alt={`Item ${item.id}`} />
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
            </div>
          </div>

          {/* Botão excluir — visível apenas para o dono da coleção */}
          {/* TODO: mockIsOwner será substituído pela verificação real do token */}
          {mockIsOwner && (
            <div className="edit-collection-delete-row">
              <button
                className="edit-collection-delete-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                excluir coleção
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <p className="delete-modal-text">
              Tem certeza que deseja excluir esta coleção? Essa ação não pode ser desfeita.
            </p>
            <div className="delete-modal-actions">
              <button
                className="delete-modal-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                cancelar
              </button>
              <button
                className="delete-modal-confirm"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "excluindo..." : "excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de sucesso após exclusão */}
      {deleteSuccess && (
        <div className="delete-success-toast">
          Coleção excluída com sucesso!
        </div>
      )}

    </div>
  );
}
