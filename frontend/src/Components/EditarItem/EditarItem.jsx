import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch, API_BASE_URL } from "../../api";
import "./EditarItem.css";

const MAX_IMAGES = 3;

// Monta a URL completa da imagem, caso o back retorne um path relativo (ex: /media/...)
function resolveImageUrl(path) {
  if (!path) return path;
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

export default function EditItemPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState(null);

  const [name, setName] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [description, setDescription] = useState("");

  // Cada imagem: { id?, preview, isExisting, file?, markedForDelete? }
  const [images, setImages] = useState([]);

  const [collections, setCollections] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");

  // Estados do modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [itemRes, profileRes] = await Promise.all([
          apiFetch(`/api/items/${id}/`),
          apiFetch("/api/profile/"),
        ]);

        let itemData = null;
        let profile = null;

        if (profileRes.ok) {
          profile = await profileRes.json();
        }

        if (itemRes.ok) {
          itemData = await itemRes.json();
          setItem(itemData);
          setName(itemData.name);
          setDescription(itemData.description);
          setCollectionId(itemData.collection);
          setImages(
            itemData.images.map((img) => ({
              id: img.id,
              preview: resolveImageUrl(img.image),
              isExisting: true,
              markedForDelete: false,
            }))
          );
        }

        // Busca só as coleções do usuário logado
        if (profile) {
          const collectionsRes = await apiFetch(`/api/collections/?owner=${profile.id}`);
          if (collectionsRes.ok) {
            const cols = await collectionsRes.json();
            setCollections(Array.isArray(cols) ? cols : cols.results ?? []);
          }

          if (itemData) {
            setIsOwner(profile.username === itemData.owner);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [id]);

  // Quantas imagens vão "sobrar" visualmente (existentes não marcadas + novas)
  const visibleImages = images.filter((img) => !img.markedForDelete);

  const handleRemoveImage = (img, index) => {
    if (img.isExisting) {
      // Imagem existente: só marca para exclusão, deleta de fato ao salvar
      setImages((prev) =>
        prev.map((i) =>
          i === img ? { ...i, markedForDelete: true } : i
        )
      );
    } else {
      // Imagem nova: remove direto do estado (ainda nem foi enviada)
      setImages((prev) => prev.filter((i) => i !== img));
    }
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);

    if (visibleImages.length + files.length > MAX_IMAGES) {
      setImageError(`Você pode ter no máximo ${MAX_IMAGES} imagens.`);
      e.target.value = "";
      return;
    }

    setImageError("");

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false,
      markedForDelete: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const handleSaveItem = async () => {
    if (!name.trim()) {
      setNameError("O nome do item é obrigatório.");
      return false;
    }

    try {
      const res = await apiFetch(`/api/items/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          description,
          collection: collectionId,
        }),
      });

      if (!res.ok) {
        alert("Erro ao atualizar item.");
        return false;
      }

      return true;
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar item.");
      return false;
    }
  };

  // Deleta no back as imagens existentes marcadas para exclusão
  const handleDeleteMarkedImages = async () => {
    const toDelete = images.filter((img) => img.isExisting && img.markedForDelete);

    for (const img of toDelete) {
      try {
        const res = await apiFetch(`/api/item-images/${img.id}/`, {
          method: "DELETE",
        });

        if (!res.ok) {
          console.error(`Erro ao excluir imagem ${img.id}`);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Envia ao back as imagens novas (ainda não salvas)
  const handleUploadNewImages = async () => {
    const toUpload = images.filter((img) => !img.isExisting);

    for (const img of toUpload) {
      const formData = new FormData();
      formData.append("image", img.file);

      try {
        const res = await apiFetch(`/api/items/${id}/images/`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          console.error("Erro ao enviar imagem", img.file?.name);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Botão único: salva dados do item + remove imagens marcadas + envia imagens novas
  const handleSaveAll = async () => {
    setSaveLoading(true);

    try {
      const itemSaved = await handleSaveItem();

      if (!itemSaved) {
        return;
      }

      await handleDeleteMarkedImages();
      await handleUploadNewImages();

      // Recarrega as imagens atualizadas do servidor para sincronizar ids/urls
      const imagesRes = await apiFetch(`/api/items/${id}/images/`);
      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        setImages(
          imagesData.map((img) => ({
            id: img.id,
            preview: resolveImageUrl(img.image),
            isExisting: true,
            markedForDelete: false,
          }))
        );
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await apiFetch(`/api/items/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Erro ao excluir.");
        return;
      }

      alert("Excluído com sucesso!");
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="edit-item-page">

      {/* Cabeçalho */}
      <header className="edit-item-header">
        <button
          className="edit-item-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      <main className="edit-item-main">
        <h2 className="edit-item-title">Editar Item</h2>

        <div className="edit-item-card">

          {/* Grid de imagens */}
          <div className="edit-item-images-section">
            <div className="edit-item-images-grid">
              {visibleImages.map((img, i) => (
                <div key={img.id ?? `new-${i}`} className="edit-item-image-wrap">
                  <img src={img.preview} alt={`Imagem ${i + 1}`} />
                  <button
                    className="edit-item-remove-img-btn"
                    onClick={() => handleRemoveImage(img, i)}
                    aria-label="Remover imagem"
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

              {visibleImages.length < MAX_IMAGES && (
                <label className="edit-item-add-img-btn" aria-label="Adicionar imagem">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleAddImages}
                  />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                </label>
              )}
            </div>

            {imageError && <p className="edit-item-error">{imageError}</p>}

          </div>

          {/* Campos de edição */}
          <div className="edit-item-fields">

            {/* Campo Nome */}
            <div className="edit-item-field">
              <label className="edit-item-label">Nome</label>
              <input
                className={`edit-item-input ${nameError ? "input-error" : ""}`}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim() !== "") setNameError("");
                }}
              />
              {nameError && <p className="edit-item-error">{nameError}</p>}

            </div>

            {/* Campo Coleção */}
            <div className="edit-item-field">
              <label className="edit-item-label">Coleção</label>
              <div className="edit-item-select-wrap">
                <select
                  className="edit-item-select"
                  value={collectionId}
                  onChange={(e) => setCollectionId(Number(e.target.value))}
                >
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campo Descrição */}
            <div className="edit-item-field">
              <label className="edit-item-label">Descrição</label>

              <textarea
                className="edit-item-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="edit-item-save-row">
              <button
                className="edit-item-save-btn"
                onClick={handleSaveAll}
                disabled={saveLoading}
              >

                {saveLoading
                  ? "Salvando..."
                  : saveSuccess
                    ? "Salvo!"
                    : "Salvar alterações"}

              </button>
            </div>
            {/* Botão excluir — visível apenas para o dono do item */}
            {isOwner && (
              <div className="edit-item-delete-row">
                <button
                  className="edit-item-delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                >
                  excluir item
                </button>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <p className="delete-modal-text">
              Tem certeza que deseja excluir este item? Essa ação não pode ser desfeita.
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
          Item excluído com sucesso!
        </div>
      )}

    </div>
  );
}
