import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch, getLoggedUserId } from "../../api";
import "./ColectionPage.css";

export default function CollectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorited, setFavorited] = useState(false);
  const [favoriteRecordId, setFavoriteRecordId] = useState(null);

  useEffect(() => {
    const carregarColecao = async () => {
      try {
        const [collectionRes, itemsRes, favoriteRes] = await Promise.all([
          apiFetch(`/api/collections/${id}/`),
          apiFetch(`/api/items/?collection=${id}`),
          apiFetch("/api/favorite-collections/"),
        ]);

        if (!collectionRes.ok) {
          setError("Coleção não encontrada.");
          return;
        }

        const collectionData = await collectionRes.json();
        setCollection(collectionData);

        if (itemsRes.ok) {
          const data = await itemsRes.json();
          setItems(Array.isArray(data) ? data : data.results ?? []);
        }

        if (favoriteRes.ok) {
          const favorites = await favoriteRes.json();
          const list = Array.isArray(favorites) ? favorites : favorites.results ?? [];
          const fav = list.find((f) => f.collection?.id === collectionData.id);
          if (fav) {
            setFavorited(true);
            setFavoriteRecordId(fav.id);
          }
        }
      } catch {
        setError("Erro ao carregar coleção.");
      } finally {
        setLoading(false);
      }
    };
    carregarColecao();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!collection) return;
    if (favorited) {
      setFavorited(false);
      try {
        await apiFetch(`/api/favorite-collections/${favoriteRecordId}/`, { method: "DELETE" });
        setFavoriteRecordId(null);
      } catch {
        setFavorited(true);
      }
    } else {
      setFavorited(true);
      try {
        const res = await apiFetch("/api/favorite-collections/", {
          method: "POST",
          body: JSON.stringify({ collection_id: collection.id }),
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

  if (loading) return <div className="collection-page"><p style={{ textAlign: "center", padding: 40 }}>Carregando...</p></div>;
  if (error || !collection) return <div className="collection-page"><p style={{ textAlign: "center", color: "#e91e8c", padding: 40 }}>{error}</p></div>;

  return (
    <div className="collection-page">
      <header className="collection-page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Voltar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      <main className="collection-page-main">
        <div className="collection-top-info">
          <div className="collection-title-row">
            <h2 className="collection-name">{collection.name}</h2>
            <button className="collection-heart-btn" onClick={handleToggleFavorite} aria-label={favorited ? "Desfavoritar" : "Favoritar"}>
              {favorited ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#e91e8c">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              )}
            </button>
          </div>

          {/* Dono da coleção — clicável, navega para o perfil */}
          <div
            className="collection-owner"
            style={{ cursor: "pointer" }}
            onClick={() => {
            const loggedId = getLoggedUserId();
            if (collection.owner_id === loggedId) {
              navigate(`/perfil/${loggedId}`);
            } else {
              navigate(`/perfil-usuario/${collection.owner_id}`);
            }
          }}
          >
            <span className="collection-owner-name">{collection.owner}</span>
            <div
              className="collection-owner-avatar"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#fce4ec",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#c2185b",
                fontWeight: 600,
              }}
            >
              {collection.owner?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        </div>

        <div className="collection-grid">
          {items.map((item) => (
            <div key={item.id} className="collection-item-card" onClick={() => navigate(`/item/${item.id}`)}>
              <div className="collection-item-image-wrapper">
                {item.images?.length > 0 ? (
                  <img className="collection-item-image" src={item.images[0].image} alt={item.name} />
                ) : (
                  <div className="collection-item-image" style={{ background: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2185b" }}>
                    Sem imagem
                  </div>
                )}
              </div>
              <p className="collection-item-name">{item.name}</p>
            </div>
          ))}
        </div>

        <div className="collection-description">
          <p className="collection-description-label">Descrição</p>
          <div className="collection-description-box">
            {collection.description || ""}
          </div>
        </div>
      </main>
    </div>
  );
}
