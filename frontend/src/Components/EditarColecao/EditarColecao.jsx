import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../api";
import "./EditarColecao.css";

export default function EditCollectionPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [items, setItems] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const [nameSaved, setNameSaved] = useState(false);
  const [descriptionSaved, setDescriptionSaved] = useState(false);

  const [nameError, setNameError] = useState("");

  // Estados do modal de exclusão
  const [showDeleteCollectionModal, setShowDeleteCollectionModal] = useState(false);
  const [deleteCollectionSuccess, setDeleteCollectionSuccess] = useState(false);
  const [deleteCollectionLoading, setDeleteCollectionLoading] = useState(false);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteItemSuccess, setDeleteItemSuccess] = useState(false);
  const [deleteItemLoading, setDeleteItemLoading] = useState(false);

  // ── Carrega a coleção e os itens dela ──────────────────────
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [colRes, profileRes] = await Promise.all([
          apiFetch(`/api/collections/${id}/`),
          apiFetch("/api/profile/"),
        ]);

        if (colRes.ok) {
          const colData = await colRes.json();
          setCollection(colData);
          setName(colData.name);
          setDescription(colData.description ?? "");

          // A coleção não retorna a lista de itens com id próprio pra exclusão
          // individual (o serializer só manda "images", que são URLs soltas).
          // Por isso buscamos os itens reais filtrando por collection.
          const itemsRes = await apiFetch(`/api/items/?collection=${id}`);
          if (itemsRes.ok) {
            const itemsData = await itemsRes.json();
            const list = Array.isArray(itemsData) ? itemsData : itemsData.results ?? [];
            setItems(list);
          }

          if (profileRes.ok) {
            const profile = await profileRes.json();
            setIsOwner(profile.username === colData.owner);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSaveName = async () => {
    setNameError("");

    if (name.trim() === "") {
      setNameError("O nome da coleção não pode ser vazio.");
      return;
    }

    try {
      const res = await apiFetch(`/api/collections/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        alert("Erro ao salvar o nome.");
        return;
      }

      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar o nome.");
    }
  };

  const handleSaveDescription = async () => {
    try {
      const res = await apiFetch(`/api/collections/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ description }),
      });

      if (!res.ok) {
        alert("Erro ao salvar a descrição.");
        return;
      }

      setDescriptionSaved(true);
      setTimeout(() => setDescriptionSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar a descrição.");
    }
  };

  const handleConfirmDeleteCollection = async () => {
    setDeleteCollectionLoading(true);

    try {
      const res = await apiFetch(`/api/collections/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Erro ao excluir coleção.");
        setDeleteCollectionLoading(false);
        return;
      }

      setShowDeleteCollectionModal(false);
      setDeleteCollectionSuccess(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir coleção.");
    } finally {
      setDeleteCollectionLoading(false);
    }
  };

  // Combinado com o back: todo item OBRIGATORIAMENTE pertence a uma
  // coleção (collection não aceita null). Por isso não existe "remover
  // item da coleção" — a ação aqui é excluir o item de fato.
  const handleConfirmDeleteItem = async () => {
    setDeleteItemLoading(true);

    try {
      const res = await apiFetch(`/api/items/${itemToDelete}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Erro ao excluir item.");
        setDeleteItemLoading(false);
        return;
      }

      setItems((prev) => prev.filter((it) => it.id !== itemToDelete));
      setItemToDelete(null);
      setDeleteItemSuccess(true);
      setTimeout(() => setDeleteItemSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover item da coleção.");
    } finally {
      setDeleteItemLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-collection-page">
        <main className="edit-collection-main">
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="edit-collection-page">
        <main className="edit-collection-main">
          <p>Coleção não encontrada.</p>
        </main>
      </div>
    );
  }

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
              {items.map((item) => {
                // O serializer de Item provavelmente tem um campo "images"
                // com lista de objetos {id, image}. Ajustar aqui se o
                // formato real vier diferente.
                const thumb = item.images?.[0]?.image ?? item.image ?? "";

                return (
                  <div key={item.id} className="edit-collection-item-wrap">
                    <img src={thumb} alt={item.name ?? `Item ${item.id}`} />

                    {isOwner && (
                      <button
                        className="edit-collection-remove-btn"
                        aria-label="Excluir item"
                        onClick={() => setItemToDelete(item.id)}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botão excluir — visível apenas para o dono da coleção */}
          {isOwner && (
            <div className="edit-collection-delete-row">
              <button
                className="edit-collection-delete-btn"
                onClick={() => setShowDeleteCollectionModal(true)}
              >
                excluir coleção
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Modal de confirmação de exclusão da coleção */}
      {showDeleteCollectionModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <p className="delete-modal-text">
              Tem certeza que deseja excluir esta coleção? Essa ação não pode ser desfeita.
            </p>
            <div className="delete-modal-actions">
              <button
                className="delete-modal-cancel"
                onClick={() => setShowDeleteCollectionModal(false)}
                disabled={deleteCollectionLoading}
              >
                cancelar
              </button>
              <button
                className="delete-modal-confirm"
                onClick={handleConfirmDeleteCollection}
                disabled={deleteCollectionLoading}
              >
                {deleteCollectionLoading ? "excluindo..." : "excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de remoção de item da coleção */}
      {itemToDelete !== null && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <p className="delete-modal-text">
              Tem certeza que deseja excluir este item? Como todo item precisa pertencer a uma coleção, não é possível apenas removê-lo daqui — ele será excluído por completo. Essa ação não pode ser desfeita.
            </p>
            <div className="delete-modal-actions">
              <button
                className="delete-modal-cancel"
                onClick={() => setItemToDelete(null)}
                disabled={deleteItemLoading}
              >
                cancelar
              </button>
              <button
                className="delete-modal-confirm"
                onClick={handleConfirmDeleteItem}
                disabled={deleteItemLoading}
              >
                {deleteItemLoading ? "excluindo..." : "excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteCollectionSuccess && (
        <div className="delete-success-toast">
          Coleção excluída com sucesso!
        </div>
      )}
      {deleteItemSuccess && (
        <div className="delete-success-toast">
          Item excluído com sucesso!
        </div>
      )}

    </div>
  );
}
