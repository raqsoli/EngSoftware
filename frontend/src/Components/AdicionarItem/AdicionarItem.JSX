import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api"; //ajuste o caminho conforme a pasta real do seu arquivo
import "./AdicionarItem.css";

const MAX_IMAGES = 3;

export default function AdicionarItem() {
  const navigate = useNavigate();

  // antes era mockCollections fixo. Agora vem do back via GET /api/collections/?owner=<id>
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadCollectionsError, setLoadCollectionsError] = useState("");

  const [name, setName] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false); // feedback de carregamento ao salvar

  const [nameError, setNameError] = useState("");
  const [collectionError, setCollectionError] = useState("");
  const [imageError, setImageError] = useState("");
  const [serverError, setServerError] = useState(""); // erro genérico do back

  // busca o usuário logado e, com o id dele, busca só as coleções dele
  useEffect(() => {
    const carregarColecoes = async () => {
      try {
        const profileRes = await apiFetch("/api/profile/");

        if (!profileRes.ok) {
          setLoadCollectionsError("Não foi possível identificar o usuário logado.");
          setLoadingCollections(false);
          return;
        }

        const profile = await profileRes.json();

        const response = await apiFetch(`/api/collections/?owner=${profile.id}`);

        if (!response.ok) {
          setLoadCollectionsError("Não foi possível carregar suas coleções.");
          setLoadingCollections(false);
          return;
        }

        const data = await response.json();
        // Algumas APIs Django retornam a lista direto, outras dentro de "results"
        // (paginação). Tratamos os dois casos por segurança.
        setCollections(Array.isArray(data) ? data : data.results ?? []);
        setLoadingCollections(false);
      } catch (err) {
        setLoadCollectionsError("Não foi possível conectar ao servidor.");
        setLoadingCollections(false);
      }
    };

    carregarColecoes();
  }, []);

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageError("");
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      setImageError(`Você pode adicionar no máximo ${MAX_IMAGES} imagens.`);
      e.target.value = "";
      return;
    }

    setImageError("");

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages([...images, ...newImages]);
    e.target.value = "";
  };

  const canSave = name.trim() !== "" && collectionId !== "";

  // envia as imagens selecionadas para o item recém-criado
  const enviarImagens = async (itemId) => {
    for (const img of images) {
      const formData = new FormData();
      formData.append("image", img.file);

      try {
        const res = await apiFetch(`/api/items/${itemId}/images/`, {
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

  // cria o item (sem imagens) e, em seguida, envia as imagens separadamente
  const handleSave = async () => {
    setNameError("");
    setCollectionError("");
    setServerError("");

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

    setSaving(true);

    try {
      const response = await apiFetch("/api/items/", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          collection: Number(collectionId),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.name) {
          setNameError(Array.isArray(data.name) ? data.name[0] : data.name);
        }
        if (data.collection) {
          setCollectionError(Array.isArray(data.collection) ? data.collection[0] : data.collection);
        }
        if (!data.name && !data.collection) {
          setServerError("Não foi possível criar o item.");
        }
        setSaving(false);
        return;
      }

      const newItem = await response.json();

      // item criado com sucesso — agora envia as imagens (se houver)
      if (images.length > 0) {
        await enviarImagens(newItem.id);
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => navigate(-1, { state: { newItem } }), 600);
    } catch (err) {
      setServerError("Não foi possível conectar ao servidor.");
      setSaving(false);
    }
  };

  // exibe carregamento enquanto busca as coleções
  if (loadingCollections) {
    return (
      <div className="add-item-page">
        <main className="add-item-main">
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="add-item-page">

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

          <div className="add-item-images-section">
            <div className="add-item-images-grid">
              {images.map((img, i) => (
                <div key={i} className="add-item-image-wrap">
                  <img src={img.preview} alt={`Imagem ${i + 1}`} />
                  <button
                    className="add-item-remove-img-btn"
                    onClick={() => handleRemoveImage(i)}
                    aria-label="Remover imagem"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
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
              )}
            </div>
            {imageError && <p className="add-item-error">{imageError}</p>}
          </div>

          <div className="add-item-fields">

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

            <div className="add-item-field">
              <label className="add-item-label">Coleção</label>
              <div className="add-item-select-wrap">
                <select
                  className={`add-item-select${collectionError ? " input-error" : ""}`}
                  value={collectionId}
                  onChange={(e) => { setCollectionId(e.target.value); setCollectionError(""); }}
                >
                  <option value="">Selecione uma coleção</option>
                  {/*antes era mockCollections, agora é collections (filtradas pelo owner) */}
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
              </div>
              {collectionError && <p className="add-item-error">{collectionError}</p>}
              {/*avisa se não há coleções pra escolher */}
              {!loadCollectionsError && collections.length === 0 && (
                <p className="add-item-error">
                  Você ainda não tem nenhuma coleção. Crie uma coleção primeiro.
                </p>
              )}
              {loadCollectionsError && <p className="add-item-error">{loadCollectionsError}</p>}
            </div>

            <div className="add-item-field">
              <label className="add-item-label">Descrição</label>
              <textarea
                className="add-item-textarea"
                placeholder="Descreva o item (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {serverError && <p className="add-item-error">{serverError}</p>}

            <div className="add-item-save-row">
              <button
                className="add-item-save-btn"
                onClick={handleSave}
                disabled={!canSave || saving}
              >
                {saved ? "salvo!" : saving ? "salvando..." : "salvar"}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
