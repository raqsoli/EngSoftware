import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditarItem.css";

// ============================================================
// DADOS MOCKADOS — substituir quando o back estiver pronto
// TODO: remover mockItem e substituir por chamada à API:
// const [item, setItem] = useState(null)
// useEffect(() => {
//   fetch('url-da-api/item/' + id)
//     .then(res => res.json())
//     .then(data => setItem(data))
// }, [id])
// O back vai retornar: id, name, collectionId, description, images
// ============================================================
const mockItem = {
  id: 1,
  name: "Hello Kitty - McDonalds 2025",
  collectionId: 1,
  description: "",
  images: [
    "https://placehold.co/120x120/fce4ec/c2185b?text=HK+1",
    "https://placehold.co/120x120/f8bbd0/ad1457?text=HK+2",
    "https://placehold.co/120x120/f48fb1/880e4f?text=HK+3",
  ],
};

// ============================================================
// TODO: remover mockCollections e substituir por chamada à API:
// fetch('url-da-api/usuario/colecoes')
// O back vai retornar: id, name
// ============================================================
const mockCollections = [
  { id: 1, name: "McDonalds" },
  { id: 2, name: "Sanrio" },
  { id: 3, name: "Disney" },
];

export default function EditItemPage() {
  const navigate = useNavigate();
  // TODO: usar o id para buscar o item correto na API
  const { id } = useParams();

  // Estados dos campos
  // TODO: quando o back estiver pronto, iniciar com os dados reais do item
  const [name, setName] = useState(mockItem.name);
  const [collectionId, setCollectionId] = useState(mockItem.collectionId);
  const [description, setDescription] = useState(mockItem.description);
  const [images, setImages] = useState(mockItem.images);

  // Estados de feedback
  const [nameSaved, setNameSaved] = useState(false);
  const [collectionSaved, setCollectionSaved] = useState(false);
  const [descriptionSaved, setDescriptionSaved] = useState(false);

  // Remove uma imagem da lista pelo índice
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Adiciona novas imagens pelo seletor de arquivos
  // TODO: quando o back estiver pronto, enviar as imagens para a API
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };
  // estados de erro
  const [nameError, setNameError] = useState("");
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
                  <img src={img} alt={`Imagem ${i + 1}`} />
                  {/* Botão de remover imagem */}
                  <button
                    className="edit-item-remove-img-btn"
                    onClick={() => handleRemoveImage(i)}
                    aria-label="Remover imagem"
                  >
                    {/* Ícone de lixeira */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              ))}

              {/* Botão de adicionar imagem */}
              {/* TODO: quando o back estiver pronto, enviar imagem para a API */}
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
                // TODO: valor inicial virá do back
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && <p className="edit-item-error">{nameError}</p>}
              
              <div className="edit-item-save-row">
                <button className="edit-item-save-btn" onClick={handleSaveName}>
                  {nameSaved ? "salvo!" : "salvar"}
                </button>
              </div>
            </div>

            {/* Campo Coleção — dropdown com coleções do usuário */}
            <div className="edit-item-field">
              <label className="edit-item-label">Coleção</label>
              <div className="edit-item-select-wrap">
                <select
                  className="edit-item-select"
                  value={collectionId}
                  // TODO: opções virão da API com as coleções do usuário
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
                // TODO: valor inicial virá do back
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="edit-item-save-row">
                <button className="edit-item-save-btn" onClick={handleSaveDescription}>
                  {descriptionSaved ? "salvo!" : "salvar"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
