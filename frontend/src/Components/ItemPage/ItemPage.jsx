import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch, API_BASE_URL, getLoggedUserId } from "../../api";
import "./ItemPage.css";

export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [favoriteRecordId, setFavoriteRecordId] = useState(null);

  useEffect(() => {
    const carregarItem = async () => {
      try {
        const [itemRes, favItemsRes, imagesRes] = await Promise.all([
          apiFetch(`/api/items/${id}/`),
          apiFetch("/api/favorite-items/"),
          apiFetch(`/api/items/${id}/images/`),
        ]);

        if (!itemRes.ok) {
          setError("Item não encontrado.");
          setLoading(false);
          return;
        }

        const itemData = await itemRes.json();

        let images = [];
        if (imagesRes.ok) {
          images = await imagesRes.json();
        }

        setItem({ ...itemData, images });

        if (favItemsRes.ok) {
          const favData = await favItemsRes.json();
          const list = Array.isArray(favData) ? favData : favData.results ?? [];
          const favRecord = list.find((f) => f.item?.id === itemData.id);
          if (favRecord) {
            setFavorited(true);
            setFavoriteRecordId(favRecord.id);
          }
        }
      } catch {
        setError("Não foi possível carregar o item.");
      } finally {
        setLoading(false);
      }
    };
    carregarItem();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (favorited) {
      setFavorited(false);
      try {
        await apiFetch(`/api/favorite-items/${favoriteRecordId}/`, { method: "DELETE" });
        setFavoriteRecordId(null);
      } catch {
        setFavorited(true);
      }
    } else {
      setFavorited(true);
      try {
        const res = await apiFetch("/api/favorite-items/", {
          method: "POST",
          body: JSON.stringify({ item_id: item.id }),
        });
        if (res.ok) {
          const data = await res.json();
          setFavoriteRecordId(data.id);
        } else {
          setFavorited(false);
        }
      } catch {
        setFavorited(false);
      }
    }
  };

  const nextImage = () => {
    const images = item?.images ?? [];
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <div className="item-page"><p style={{ textAlign: "center", padding: 40 }}>Carregando...</p></div>;
  if (error || !item) return <div className="item-page"><p style={{ textAlign: "center", color: "#e91e8c", padding: 40 }}>{error || "Item não encontrado."}</p></div>;

  const images = item.images ?? [];
  const collectionId = item.collection;

  return (
    <div className="item-page">
      <header className="item-page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Voltar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      <main className="item-page-main">
        <div className="item-top-info">
        <div>
          <h2 className="item-name">{item.name}</h2>
          <p className="item-collection" onClick={() => navigate(`/colecao/${collectionId}`)}>
            Coleção: {item.collection_name ?? collectionId}
          </p>
          {item.owner_id === getLoggedUserId() && (
            <button
              className="item-edit-btn"
              onClick={() => navigate(`/editar-item/${item.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 6,
                background: "none",
                border: "none",
                padding: 0,
                color: "#c2185b",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              editar item
            </button>
          )}
        </div>

          {/* Dono do item — clicável, navega para o perfil */}
          <div
            className="item-owner"
            style={{ cursor: "pointer" }}
            onClick={() => {
            const loggedId = getLoggedUserId();
            if (item.owner_id === loggedId) {
              navigate(`/perfil/${loggedId}`);
            } else {
              navigate(`/perfil-usuario/${item.owner_id}`);
            }
          }}
          >
            <span className="item-owner-name">{item.owner}</span>
            <div
              className="item-owner-avatar"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#fce4ec",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#c2185b",
                fontWeight: 600,
              }}
            >
              {item.owner?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        </div>

        <div className="item-gallery">
          {images.length > 0 ? (
            <img
              className="item-gallery-image"
              src={images[currentImage].image.startsWith("http") ? images[currentImage].image : `${API_BASE_URL}${images[currentImage].image}`}
              alt={item.name}
            />
          ) : (
            <div className="item-gallery-image" style={{ background: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2185b", fontSize: 14 }}>
              Sem imagem
            </div>
          )}

          {images.length > 1 && (
            <button className="gallery-arrow" onClick={nextImage} aria-label="Próxima imagem">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          <button className="item-heart-btn" onClick={handleToggleFavorite} aria-label={favorited ? "Desfavoritar" : "Favoritar"}>
            {favorited ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#e91e8c">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          </button>

          {images.length > 1 && (
            <div className="gallery-dots">
              {images.map((_, i) => (
                <span key={i} className={`gallery-dot ${i === currentImage ? "active" : ""}`} onClick={() => setCurrentImage(i)} />
              ))}
            </div>
          )}
        </div>

        <div className="item-description">
          <p className="item-description-label">Descrição</p>
          <div className="item-description-box">
            {item.description || ""}
          </div>
        </div>
      </main>
    </div>
  );
}
