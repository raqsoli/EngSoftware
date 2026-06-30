import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../api";
import "./UserProfilePage.css";

function formatHearts(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return n;
}

// ─── ItemCard ────────────────────────────────────────────────────────────────
function ItemCard({ item }) {
  const navigate = useNavigate();
  // item.images é um array de { id, image } — pega a primeira, ou placeholder
  const thumb = item.images?.[0]?.image || "https://placehold.co/200x200/fce4ec/c2185b?text=Item";

  return (
    <div className="profile-item-card" onClick={() => navigate(`/item/${item.id}`)}>
      <div className="profile-item-image">
        <img src={thumb} alt={item.name} />
      </div>
      <div className="profile-item-info">
        <div>
          <p className="profile-item-name">{item.name}</p>
          <p className="profile-item-collection">Coleção: {item.collection_name}</p>
        </div>
        <button
          className="profile-edit-icon-btn"
          onClick={(e) => { e.stopPropagation(); navigate(`/editar-item/${item.id}`); }}
          aria-label="Editar item"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── CollectionCard ───────────────────────────────────────────────────────────
// variant="edit"     → ícone de lápis (aba Coleções)
// variant="favorite" → ícone de coração (aba Favoritos)
function CollectionCard({ collection, variant = "edit", favoriteId, onUnfavorite }) {
  const navigate = useNavigate();
  // collection.images já é um array de URLs absolutas (montado pelo serializer)
  const images = collection.images || [];

  async function handleUnfavorite(e) {
    e.stopPropagation();
    try {
      await apiFetch(`/api/favorite-collections/${favoriteId}/`, {
        method: "DELETE",
      });
      onUnfavorite(favoriteId);
    } catch (err) {
      console.error("Erro ao desfavoritar coleção:", err);
    }
  }

  return (
    <div className="profile-collection-card" onClick={() => navigate(`/colecao/${collection.id}`)}>
      {images.length > 0 ? (
        <div className="profile-collection-grid">
          {images.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt="" />
          ))}
        </div>
      ) : (
        <div className="profile-collection-empty" />
      )}
      <div className="profile-collection-info">
        <div>
          <p className="profile-collection-name">{collection.name}</p>
          <p className="profile-collection-owner">{collection.owner}</p>
        </div>

        {variant === "edit" ? (
          <button
            className="profile-edit-icon-btn"
            onClick={(e) => { e.stopPropagation(); navigate(`/editar-colecao/${collection.id}`); }}
            aria-label="Editar coleção"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        ) : (
          <button
            className="profile-heart-btn"
            onClick={handleUnfavorite}
            aria-label="Desfavoritar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e91e8c">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── FavoriteItemCard ─────────────────────────────────────────────────────────
// favoriteId = id do registro FavoriteItem (não do item em si)
function FavoriteItemCard({ item, favoriteId, onUnfavorite }) {
  const navigate = useNavigate();
  const thumb = item.images?.[0]?.image || "https://placehold.co/200x200/fce4ec/c2185b?text=Fav";

  async function handleUnfavorite(e) {
    e.stopPropagation();
    try {
      await apiFetch(`/api/favorite-items/${favoriteId}/`, {
        method: "DELETE",
      });
      onUnfavorite(favoriteId);
    } catch (err) {
      console.error("Erro ao desfavoritar item:", err);
    }
  }

  return (
    <div className="profile-item-card" onClick={() => navigate(`/item/${item.id}`)}>
      <div className="profile-item-image">
        <img src={thumb} alt={item.name} />
      </div>
      <div className="profile-item-info">
        <div>
          <p className="profile-item-name">{item.name}</p>
          <p className="profile-item-collection">Coleção: {item.collection_name}</p>
        </div>
        <button
          className="profile-heart-btn"
          onClick={handleUnfavorite}
          aria-label="Desfavoritar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#e91e8c">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── HorizontalScroll ─────────────────────────────────────────────────────────
function HorizontalScroll({ children }) {
  const scrollRef = useRef(null);
  const scroll = () => scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });

  return (
    <div className="profile-scroll-wrapper">
      <div ref={scrollRef} className="profile-scroll-track">{children}</div>
      <button className="profile-arrow-btn" onClick={scroll} aria-label="Próximo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

// ─── Page principal ───────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("itens");

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);       // [{ id, item }]
  const [favoriteCollections, setFavoriteCollections] = useState([]); // [{ id, collection }]
  const [loading, setLoading] = useState(true);

  // ── Busca inicial ──────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Perfil do usuário logado
      const profileRes = await apiFetch(`/api/profile/`);
      const profileData = await profileRes.json();
      setUser(profileData);

      const userId = profileData.id;

      // 2. Itens e coleções do usuário (em paralelo)
      const [itemsRes, collectionsRes, favItemsRes, favColsRes] = await Promise.all([
        apiFetch(`/api/items/?owner=${userId}`),
        apiFetch(`/api/collections/?owner=${userId}`),
        apiFetch(`/api/favorite-items/`),
        apiFetch(`/api/favorite-collections/`),
      ]);

      setItems(await itemsRes.json());
      setCollections(await collectionsRes.json());
      setFavoriteItems(await favItemsRes.json());
      setFavoriteCollections(await favColsRes.json());
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Novo item/coleção vindo de outra página via location.state ─────────────
  // (mantido para compatibilidade enquanto não há refresh automático pós-POST)
  useEffect(() => {
    if (location.state?.newItem) {
      setItems((prev) => [...prev, location.state.newItem]);
    }
    if (location.state?.newCollection) {
      setCollections((prev) => [...prev, location.state.newCollection]);
    }
    if (location.state?.newItem || location.state?.newCollection) {
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  // ── Desfavoritar ───────────────────────────────────────────────────────────
  function handleUnfavoriteItem(favoriteId) {
    setFavoriteItems((prev) => prev.filter((f) => f.id !== favoriteId));
  }

  function handleUnfavoriteCollection(favoriteId) {
    setFavoriteCollections((prev) => prev.filter((f) => f.id !== favoriteId));
  }

  // ── Avatar ─────────────────────────────────────────────────────────────────
  const avatarLetter = user?.username?.[0]?.toUpperCase() ?? "?";
  const avatarSrc = user?.image
    ? user.image  // URL absoluta vinda do back
    : `https://placehold.co/70x70/fce4ec/c2185b?text=${avatarLetter}`;

  if (loading) {
    return <div className="profile-page" style={{ padding: 40 }}>Carregando...</div>;
  }

  return (
    <div className="profile-page">

      {/* Cabeçalho */}
      <header className="profile-header">
        <button
          className="profile-back-btn"
          onClick={() => navigate("/home")}
          aria-label="Voltar para homepage"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      {/* Informações do usuário */}
      <div className="profile-info">
        <div className="profile-info-left">
          <img className="profile-avatar" src={avatarSrc} alt={user?.username} />
          <div>
            <p className="profile-name">{user?.username}</p>
            <button className="profile-edit-btn" onClick={() => navigate("/editar-perfil")}>
              editar perfil
            </button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-label">Itens</span>
            <span className="profile-stat-value">{items.length}</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-label">Coleções</span>
            <span className="profile-stat-value">{collections.length}</span>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="profile-tabs">
        {["itens", "colecoes", "favoritos"].map((tab) => (
          <button
            key={tab}
            className={`profile-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "itens" ? "Itens" : tab === "colecoes" ? "Coleções" : "Favoritos"}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <main className="profile-content">

        {/* Aba Itens */}
        {activeTab === "itens" && (
          <section className="profile-section">
            <p className="profile-section-title">Seus itens</p>
            <div className="profile-items-grid">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
              <div className="profile-add-item-card" onClick={() => navigate("/adicionar-item")}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <p className="profile-add-item-label">Adicionar Item</p>
              </div>
            </div>
          </section>
        )}

        {/* Aba Coleções */}
        {activeTab === "colecoes" && (
          <section className="profile-section">
            <p className="profile-section-title">Suas coleções</p>
            <div className="profile-items-grid">
              {collections.map((col) => (
                <CollectionCard key={col.id} collection={col} variant="edit" />
              ))}
              <div className="profile-add-item-card" onClick={() => navigate("/adicionar-colecao")}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <p className="profile-add-item-label">Adicionar Coleção</p>
              </div>
            </div>
          </section>
        )}

        {/* Aba Favoritos */}
        {activeTab === "favoritos" && (
          <>
            <section className="profile-section">
              <p className="profile-section-title">Itens favoritos</p>
              <div className="profile-items-grid">
                {favoriteItems.length === 0 && (
                  <p style={{ color: "#aaa", fontSize: 14 }}>Nenhum item favoritado ainda.</p>
                )}
                {favoriteItems.map((fav) => (
                  <FavoriteItemCard
                    key={fav.id}
                    item={fav.item}
                    favoriteId={fav.id}
                    onUnfavorite={handleUnfavoriteItem}
                  />
                ))}
              </div>
            </section>

            <section className="profile-section">
              <p className="profile-section-title">Coleções favoritas</p>
              <div className="profile-items-grid">
                {favoriteCollections.length === 0 && (
                  <p style={{ color: "#aaa", fontSize: 14 }}>Nenhuma coleção favoritada ainda.</p>
                )}
                {favoriteCollections.map((fav) => (
                  <CollectionCard
                    key={fav.id}
                    collection={fav.collection}
                    variant="favorite"
                    favoriteId={fav.id}
                    onUnfavorite={handleUnfavoriteCollection}
                  />
                ))}
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
