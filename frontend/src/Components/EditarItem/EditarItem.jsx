import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditarItem.css";

const mockItem = {
  id: 1,
  name: "Hello Kitty - McDonalds 2025",
  collectionId: 1,
  description: "",
  images: [
    { preview: "https://placehold.co/120x120/fce4ec/c2185b?text=HK+1", isExisting: true },
    { preview: "https://placehold.co/120x120/f8bbd0/ad1457?text=HK+2", isExisting: true },
    { preview: "https://placehold.co/120x120/f48fb1/880e4f?text=HK+3", isExisting: true },
  ],
};

const mockCollections = [
  { id: 1, name: "McDonalds" },
  { id: 2, name: "Sanrio" },
  { id: 3, name: "Disney" },
];

// TODO: substituir por verificação real com o token do usuário logado
// O back valida se o item pertence ao usuário — aqui simulamos que é dono
const mockIsOwner = true;

const MAX_IMAGES = 3;

export default function EditItemPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState(mockItem.name);
  const [collectionId, setCollectionId] = useState(mockItem.collectionId);
  const [description, setDescription] = useState(mockItem.description);
  const [images, setImages] = useState(mockItem.images);

  const [nameSaved, setNameSaved] = useState(false);
  const [collectionSaved, setCollectionSaved] = useState(false);
  const [descriptionSaved, setDescriptionSaved] = useState(false);

  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState(""); 

  // Estados do modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);

    // 🆕 NOVO — valida o limite de 3 imagens antes de adicionar
    if (images.length + files.length > MAX_IMAGES) {
      setImageError(`Você pode ter no máximo ${MAX_IMAGES} imagens.`);
      e.target.value = "";
      return;
    }

    setImageError("");

    // 🆕 ALTERADO — guarda o File real (isExisting: false = imagem nova, ainda não salva)
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    }));

    setImages([...images, ...newImages]);
    e.target.value = "";
  };

  const handleSaveName = () => {
    setNameError("");
    if (name.trim() === "") {
      setNameError("O nome do item não pode ser vazio.");
      return;
    }
    // TODO: fetch('url-da-api/item/' + id + '/nome', { method: 'PUT', body: JSON.stringify({ name }) })
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleSaveCollection = () => {
    // TODO: fetch('url-da-api/item/' + id + '/colecao', { method: 'PUT', body: JSON.stringify({ collectionId }) })
    setCollectionSaved(true);
    setTimeout(() => setCollectionSaved(false), 2000);
  };

  const handleSaveDescription = () => {
    // TODO: fetch('url-da-api/item/' + id + '/descricao', { method: 'PUT', body: JSON.stringify({ description }) })
    setDescriptionSaved(true);
    setTimeout(() => setDescriptionSaved(false), 2000);
  };

  // salva as imagens (separando o que é novo do que já existia)
  const handleSaveImages = () => {
    // monta o FormData só com as imagens NOVAS (File real)
    const formData = new FormData();
    images
      .filter((img) => !img.isExisting)
      .forEach((img) => formData.append('images', img.file));

    // TODO: descomentar quando o back estiver pronto:
    // fetch('url-da-api/item/' + id + '/imagens', {
    //   method: 'POST', // ou PUT, dependendo do contrato definido com o back
    //   headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    //   body: formData,
    // })
  };

  const handleConfirmDelete = () => {
    setDeleteLoading(true);

    // TODO: fetch('url-da-api/item/' + id, { method: 'DELETE' })

    setTimeout(() => {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setDeleteSuccess(true);
      setTimeout(() => navigate(-1), 2000);
    }, 1000);
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
              {images.map((img, i) => (
                <div key={i} className="edit-item-image-wrap">
                  <img src={img.preview} alt={`Imagem ${i + 1}`} />
                  <button
                    className="edit-item-remove-img-btn"
                    onClick={() => handleRemoveImage(i)}
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

              {images.length < MAX_IMAGES && (
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
            {/* 🆕 NOVO — erro de limite + botão salvar imagens */}
            {imageError && <p className="edit-item-error">{imageError}</p>}
            <div className="edit-item-save-row">
              <button className="edit-item-save-btn" onClick={handleSaveImages}>
                salvar imagens
              </button>
            </div>
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
              <div className="edit-item-save-row">
                <button className="edit-item-save-btn" onClick={handleSaveName}>
                  {nameSaved ? "salvo!" : "salvar"}
                </button>
              </div>
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
                  {mockCollections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="edit-item-save-row">
                <button className="edit-item-save-btn" onClick={handleSaveCollection}>
                  {collectionSaved ? "salvo!" : "salvar"}
                </button>
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
              <div className="edit-item-save-row">
                <button className="edit-item-save-btn" onClick={handleSaveDescription}>
                  {descriptionSaved ? "salvo!" : "salvar"}
                </button>
              </div>
            </div>

            {/* Botão excluir — visível apenas para o dono do item */}
            {/* TODO: mockIsOwner será substituído pela verificação real do token */}
            {mockIsOwner && (
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
