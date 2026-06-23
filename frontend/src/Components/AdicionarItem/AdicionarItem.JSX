import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdicionarItem.css";

// ============================================================
// DADOS MOCKADOS — substituir quando o back estiver pronto
// TODO: remover mockCollections e substituir por chamada à API:
// const [collections, setCollections] = useState([])
// useEffect(() => {
//   fetch('url-da-api/collections/', {
//     headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
//   })
//     .then(res => res.json())
//     .then(data => setCollections(Array.isArray(data) ? data : data.results))
// }, [])
// O back vai retornar: [{ id, name }, ...]
// ============================================================
const mockCollections = [
  { id: 1, name: "McDonalds" },
  { id: 2, name: "Sanrio" },
  { id: 3, name: "Disney" },
];

export default function AdicionarItem() {
  const navigate = useNavigate();

  // Estados dos campos
  const [name, setName] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  // Estado de feedback
  const [saved, setSaved] = useState(false);

  // Estados de erro
  const [nameError, setNameError] = useState("");
  const [collectionError, setCollectionError] = useState("");

  // Remove uma imagem da lista pelo índice
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Adiciona novas imagens pelo seletor de arquivos
  // TODO: quando o back estiver pronto, enviar as imagens para a API
  // (ex: via FormData no POST de criação do item, ou em um endpoint
  // separado de upload que retorne as URLs definitivas)
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  // Botão só habilita com nome + coleção preenchidos
  const canSave = name.trim() !== "" && collectionId !== "";

  const handleSave = () => {
    setNameError("");
    setCollectionError("");

    let hasError = false;

    if (name.trim() === "") {
      setNameError("O nome do item é obrigatório.");
      hasError = true;
    }
    if (collectionId === "") {
      setCollectionError("Selecione uma coleção.");
      hasError = true;
    }
    if (hasError) return;

    // TODO: substituir pelo fetch real quando o back estiver pronto:
    // const formData = new FormData();
    // formData.append('name', name.trim());
    // formData.append('description', description.trim());
    // formData.append('collection', Number(collectionId));
    // images.forEach((img) => formData.append('images', img.file));
    //
    // fetch('url-da-api/items/', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    //   body: formData,
    // })
    //   .then(res => res.json())
    //   .then(newItem => {
    //     setSaved(true);
    //     setTimeout(() => navigate(-1, { state: { newItem } }), 600);
    //   })
    // O back retorna o item criado com o id gerado em caso de sucesso.

    const collectionName = mockCollections.find(c => String(c.id) === String(collectionId))?.name ?? "";

    // Monta o objeto do novo item no mesmo formato que o UserProfilePage espera
    const newItem = {
      id: Date.now(),
      name: name.trim(),
      collection: collectionName,
      description: description.trim(),
      images: images.length > 0
        ? images
        : ["https://placehold.co/120x120/fce4ec/c2185b?text=Novo"],
    };

    setSaved(true);
    // Exibe "salvo!" brevemente e volta para o perfil
    // O UserProfilePage lê o newItem via useLocation e adiciona na lista
    setTimeout(() => navigate(-1, { state: { newItem } }), 600);
  };

  return (
    <div className="add-item-page">

      {/* Cabeçalho — mesmo padrão de EditarItem / EditarColecao */}
      <header className="add-item-header">
        <button
          className="add-item-back-btn"
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

      <main className="add-item-main">
        <h2 className="add-item-title">Adicionar Item</h2>

        <div className="add-item-card">

          {/* Grid de imagens — mesmo padrão de EditarItem */}
          <div className="add-item-images-section">
            <div className="add-item-images-grid">
              {images.map((img, i) => (
                <div key={i} className="add-item-image-wrap">
                  <img src={img} alt={`Imagem ${i + 1}`} />
                  {/* Botão de remover imagem */}
                  <button
                    className="add-item-remove-img-btn"
                    onClick={() => handleRemoveImage(i)}
                    aria-label="Remover imagem"
                  >
                    {/* Ícone de lixeira */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Botão de adicionar imagem */}
              {/* TODO: quando o back estiver pronto, enviar imagem para a API */}
              <label className="add-item-add-img-btn" aria-label="Adicionar imagem">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleAddImages}
                />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </label>
            </div>
          </div>

          {/* Campos do item */}
          <div className="add-item-fields">

            {/* Campo Nome — obrigatório */}
            <div className="add-item-field">
              <label className="add-item-label">Nome</label>
              <input
                className={`add-item-input${nameError ? " input-error" : ""}`}
                type="text"
                placeholder="Nome do item"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(""); }}
              />
              {nameError && <p className="add-item-error">{nameError}</p>}
            </div>

            {/* Campo Coleção — dropdown, obrigatório */}
            {/* TODO: trocar mockCollections pelas coleções vindas da API */}
            <div className="add-item-field">
              <label className="add-item-label">Coleção</label>
              <div className="add-item-select-wrap">
                <select
                  className={`add-item-select${collectionError ? " input-error" : ""}`}
                  value={collectionId}
                  onChange={(e) => { setCollectionId(e.target.value); setCollectionError(""); }}
                >
                  <option value="">Selecione uma coleção</option>
                  {mockCollections.map((col) => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
              </div>
              {collectionError && <p className="add-item-error">{collectionError}</p>}
            </div>

            {/* Campo Descrição — opcional */}
            <div className="add-item-field">
              <label className="add-item-label">Descrição</label>
              <textarea
                className="add-item-textarea"
                placeholder="Descreva o item (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Botão Salvar — desabilitado até nome + coleção preenchidos */}
            <div className="add-item-save-row">
              <button
                className="add-item-save-btn"
                onClick={handleSave}
                disabled={!canSave}
              >
                {saved ? "salvo!" : "salvar"}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}