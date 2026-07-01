import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../api";
import "./PerfilOutroUsuario.css";

function formatHearts(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return n;
}

function ItemCard({ item }) {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(false);
  const [favoriteRecordId, setFavoriteRecordId] = useState(null);

  useEffect(() => {
    const checarFavorito = async () => {
      try {
        const res = await apiFetch("/api/favorite-items/");
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results ?? [];
        const fav = list.find((f) => f.item?.id === item.id);
        if (fav) {
          setFavorited(true);
          setFavoriteRecordId(fav.id);
        }
      } catch {}
    };
    checarFavorito();
  }, [item.id]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
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

  return (
    <div className="other-item-card" onClick={() => navigate(`/item/${item.id}`)}>
      <div className="other-item-image">
        {item.images?.length > 0 ? (
          <img src={item.images[0].image} alt={item.name} />
        ) : (
          <div style={{ background: "#fce4ec", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2185b" }}>
            Sem imagem
          </div>
        )}
      </div>
      <div className="other-item-info">
        <div>
          <p className="other-item-name">{item.name}</p>
          <p className="other-item-collection">Coleção: {item.collection_name ?? item.collection}</p>
        </div>
        <button className="other-heart-btn" onClick={handleToggleFavorite} aria-label={favorited ? "Desfavoritar" : "Favoritar"}>
          {favorited ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e91e8c">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function CollectionCard({ collection }) {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(false);
  const [favoriteRecordId, setFavoriteRecordId] = useState(null);

  useEffect(() => {
    const checarFavorito = async () => {
      try {
        const res = await apiFetch("/api/favorite-collections/");
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results ?? [];
        const fav = list.find((f) => f.collection?.id === collection.id);
        if (fav) {
          setFavorited(true);
          setFavoriteRecordId(fav.id);
        }
      } catch {}
    };
    checarFavorito();
  }, [collection.id]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
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

  const images = collection.images ?? [];

  return (
    <div className="other-collection-card" onClick={() => navigate(`/colecao/${collection.id}`)}>
      {images.length > 0 ? (
        <div className="other-collection-grid">
          {images.slice(0, 4).map((img, i) => (
            <img key={i} src={img.image ?? img} alt="" />
          ))}
        </div>
      ) : (
        <div className="other-collection-empty" />
      )}
      <div className="other-collection-info">
        <div>
          <p className="other-collection-name">{collection.name}</p>
          <p className="other-collection-owner">{collection.owner}</p>
        </div>
        <button className="other-heart-btn" onClick={handleToggleFavorite} aria-label={favorited ? "Desfavoritar" : "Favoritar"}>
          {favorited ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e91e8c">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function OtherUserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("itens");

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [favoriteCollections, setFavoriteCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        const [userRes, itemsRes, collectionsRes] = await Promise.all([
          apiFetch(`/api/users/${id}/`),
          apiFetch(`/api/items/?owner=${id}`),
          apiFetch(`/api/collections/?owner=${id}`),
        ]);

        if (!userRes.ok) {
          setError("Usuário não encontrado.");
          return;
        }

        const userData = await userRes.json();
        setUser(userData);

        if (itemsRes.ok) {
          const data = await itemsRes.json();
          setItems(Array.isArray(data) ? data : data.results ?? []);
        }

        if (collectionsRes.ok) {
          const data = await collectionsRes.json();
          setCollections(Array.isArray(data) ? data : data.results ?? []);
        }
      } catch {
        setError("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  // Favoritos carregados só quando a aba é aberta
  useEffect(() => {
    if (activeTab !== "favoritos") return;
    const carregarFavoritos = async () => {
      try {
        const [favItemsRes, favColsRes] = await Promise.all([
          apiFetch("/api/favorite-items/"),
          apiFetch("/api/favorite-collections/"),
        ]);

        if (favItemsRes.ok) {
          const data = await favItemsRes.json();
          const list = Array.isArray(data) ? data : data.results ?? [];
          // Filtra apenas os favoritos do usuário visitado
          setFavoriteItems(list.filter((f) => f.item?.owner_id === Number(id)).map((f) => f.item));
        }

        if (favColsRes.ok) {
          const data = await favColsRes.json();
          const list = Array.isArray(data) ? data : data.results ?? [];
          setFavoriteCollections(list.filter((f) => f.collection?.owner_id === Number(id)).map((f) => f.collection));
        }
      } catch {}
    };
    carregarFavoritos();
  }, [activeTab, id]);

  if (loading) return <div className="other-profile-page"><p style={{ textAlign: "center", padding: 40 }}>Carregando...</p></div>;
  if (error) return <div className="other-profile-page"><p style={{ textAlign: "center", color: "#e91e8c", padding: 40 }}>{error}</p></div>;

  return (
    <div className="other-profile-page">
      <header className="other-profile-header">
        <button className="other-back-btn" onClick={() => navigate(-1)} aria-label="Voltar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      <div className="other-profile-info">
        <div className="other-profile-info-left">
          {user.avatar ? (
            <img className="other-profile-avatar" src={user.avatar} alt={user.username} />
          ) : (
            <div className="other-profile-avatar" style={{ background: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2185b", fontWeight: 700, fontSize: 24 }}>
              {user.username?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <p className="other-profile-name">{user.username}</p>
        </div>

        <div className="other-profile-stats">
          <div className="other-profile-stat">
            <span className="other-profile-stat-label">Itens</span>
            <span className="other-profile-stat-value">{user.totalItems ?? items.length}</span>
          </div>
          <div className="other-profile-stat-divider" />
          <div className="other-profile-stat">
            <span className="other-profile-stat-label">Coleções</span>
            <span className="other-profile-stat-value">{user.totalCollections ?? collections.length}</span>
          </div>
        </div>
      </div>

      <div className="other-profile-tabs">
        <button className={`other-profile-tab ${activeTab === "itens" ? "active" : ""}`} onClick={() => setActiveTab("itens")}>Itens</button>
        <button className={`other-profile-tab ${activeTab === "colecoes" ? "active" : ""}`} onClick={() => setActiveTab("colecoes")}>Coleções</button>
        <button className={`other-profile-tab ${activeTab === "favoritos" ? "active" : ""}`} onClick={() => setActiveTab("favoritos")}>Favoritos</button>
      </div>

      <main className="other-profile-content">
        {activeTab === "itens" && (
          <section className="other-profile-section">
            <p className="other-section-title">Itens</p>
            {items.length === 0 ? (
              <p style={{ color: "#aaa", textAlign: "center" }}>Nenhum item ainda.</p>
            ) : (
              <div className="other-items-grid">
                {items.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>
            )}
          </section>
        )}

        {activeTab === "colecoes" && (
          <section className="other-profile-section">
            <p className="other-section-title">Coleções</p>
            {collections.length === 0 ? (
              <p style={{ color: "#aaa", textAlign: "center" }}>Nenhuma coleção ainda.</p>
            ) : (
              <div className="other-items-grid">
                {collections.map((col) => <CollectionCard key={col.id} collection={col} />)}
              </div>
            )}
          </section>
        )}

        {activeTab === "favoritos" && (
          <>
            <section className="other-profile-section">
              <p className="other-section-title">Itens favoritos</p>
              {favoriteItems.length === 0 ? (
                <p style={{ color: "#aaa", textAlign: "center" }}>Nenhum item favoritado.</p>
              ) : (
                <div className="other-items-grid">
                  {favoriteItems.map((item) => <ItemCard key={item.id} item={item} />)}
                </div>
              )}
            </section>

            <section className="other-profile-section">
              <p className="other-section-title">Coleções favoritas</p>
              {favoriteCollections.length === 0 ? (
                <p style={{ color: "#aaa", textAlign: "center" }}>Nenhuma coleção favoritada.</p>
              ) : (
                <div className="other-items-grid">
                  {favoriteCollections.map((col) => <CollectionCard key={col.id} collection={col} />)}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
