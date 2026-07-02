import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";
import "./HomePage.css";

function formatHearts(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return n;
}

function HeartIcon({ filled }) {
  if (filled) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#e91e1e">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// favoriteItems agora é um Map: { itemId -> favoriteRecordId }
// assim sabemos o ID do registro de favorito pra fazer o DELETE
function ItemCard({ item, favoriteItems, onToggleFavorite, collectionNameMap }) {
  const favorited = favoriteItems.has(item.id);
  const navigate = useNavigate();

  // o serializer retorna "images" (não "uploaded_images") no GET
  const imageUrl =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0].image
      : "https://placehold.co/200x200/fce4ec/c2185b?text=Sem+Imagem";

  // 🆕 resolve o nome da coleção pelo id usando o Map
  const collectionName = collectionNameMap?.get(item.collection) ?? `Coleção ${item.collection}`;

  return (
    <div
      className="item-card"
      onClick={() => navigate(`/item/${item.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="item-card-image">
        <img src={imageUrl} alt={item.name} />
      </div>
      <div className="item-card-info">
        <div>
          <p className="item-card-name">{item.name}</p>
          <p className="item-card-collection">Coleção: {collectionName}</p>
        </div>
        <button
          className="heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite("item", item.id, favorited);
          }}
          aria-label={favorited ? "Desfavoritar" : "Favoritar"}
        >
          <HeartIcon filled={favorited} />
        </button>
      </div>
    </div>
  );
}

// favoriteCollections agora é um Map: { collectionId -> favoriteRecordId }
function CollectionCard({ collection, favoriteCollections, onToggleFavorite }) {
  const favorited = favoriteCollections.has(collection.id);
  const navigate = useNavigate();

  const images = Array.isArray(collection.images) ? collection.images : [];

  return (
    <div
      className="collection-card"
      onClick={() => navigate(`/colecao/${collection.id}`)}
    >
      {images.length > 0 ? (
        <div className="collection-img-grid">
          {images.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt="" />
          ))}
        </div>
      ) : (
        <div className="collection-empty" />
      )}

      <div className="collection-card-info">
        <div>
          <p className="collection-card-name">{collection.name}</p>
          <p className="collection-card-owner">
            {collection.owner_username ?? collection.owner ?? ""}
          </p>
        </div>
        <div className="collection-hearts">
          <button
            className="heart-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite("collection", collection.id, favorited);
            }}
            aria-label={favorited ? "Desfavoritar" : "Favoritar"}
          >
            <HeartIcon filled={favorited} />
          </button>
          <span className="hearts-count">
            {formatHearts(collection.hearts_count ?? collection.hearts ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

function HorizontalScroll({ children }) {
  const ref = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [children]);

  const scrollLeft = () => {
    ref.current?.scrollBy({ left: -220, behavior: "smooth" });
  };

  const scrollRight = () => {
    ref.current?.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <div className="scroll-wrapper">
      {canScrollLeft && (
        <button className="arrow-btn arrow-btn-left" onClick={scrollLeft} aria-label="Anterior">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <div ref={ref} className="scroll-track">
        {children}
      </div>

      {canScrollRight && (
        <button className="arrow-btn arrow-btn-right" onClick={scrollRight} aria-label="Próximo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);

  // Map: itemId -> favoriteRecordId (id do registro na tabela FavoriteItem)
  // Exemplo: { 3: 7 } significa que o item 3 está favoritado e o registro é o id 7
  // Precisamos do favoriteRecordId para fazer o DELETE /api/favorite-items/{favoriteRecordId}/
  const [favoriteItems, setFavoriteItems] = useState(new Map());

  // Map: collectionId -> favoriteRecordId
  const [favoriteCollections, setFavoriteCollections] = useState(new Map());

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [profileId, setProfileId] = useState(null); // 🆕 id do usuário logado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(""); // 🆕 restaurado

  // 🆕 Map de id → nome da coleção, pra resolver "Coleção: 1" → "Coleção: Hello Kitty"
  const collectionNameMap = new Map(collections.map((c) => [c.id, c.name]));

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [itemsRes, collectionsRes, favItemsRes, favColsRes, profileRes] =
          await Promise.all([
            apiFetch("/api/items/"),
            apiFetch("/api/collections/"),
            apiFetch("/api/favorite-items/"),
            apiFetch("/api/favorite-collections/"),
            apiFetch("/api/profile/"),
          ]);

        if (itemsRes.ok) {
          const data = await itemsRes.json();
          setItems(Array.isArray(data) ? data : data.results ?? []);
        }

        if (collectionsRes.ok) {
          const data = await collectionsRes.json();
          setCollections(Array.isArray(data) ? data : data.results ?? []);
        }

        // Monta o Map: itemId -> favoriteRecordId
        // O serializer retorna { id, user, item } — "item" é o id do item, "id" é o id do registro
        if (favItemsRes.ok) {
          const data = await favItemsRes.json();
          const list = Array.isArray(data) ? data : data.results ?? [];
          const map = new Map(list.map((f) => [f.item?.id, f.id]));
          setFavoriteItems(map);
        }

        // Monta o Map: collectionId -> favoriteRecordId
        // O serializer retorna { id, user, collection }
        if (favColsRes.ok) {
          const data = await favColsRes.json();
          const list = Array.isArray(data) ? data : data.results ?? [];
          const map = new Map(list.map((f) => [f.collection?.id, f.id]));
          setFavoriteCollections(map);
        }

        if (profileRes.ok) {
          const data = await profileRes.json();
          setAvatarUrl(data.image ?? null);
          setProfileId(data.id ?? null); // 🆕 salva o id do usuário logado
        }
      } catch (err) {
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Favoritar: POST /api/favorite-items/ com body { item: id }
  // Desfavoritar: DELETE /api/favorite-items/{favoriteRecordId}/
  const handleToggleFavorite = async (type, id, currentlyFavorited) => {
    const endpoint =
      type === "item" ? "/api/favorite-items/" : "/api/favorite-collections/";
    const bodyKey = type === "item" ? "item_id" : "collection_id";
    const setMap = type === "item" ? setFavoriteItems : setFavoriteCollections;
    const currentMap = type === "item" ? favoriteItems : favoriteCollections;

    if (currentlyFavorited) {
      // Desfavoritar — pega o id do registro de favorito no Map
      const favoriteRecordId = currentMap.get(id);

      // Atualiza visualmente na hora
      setMap((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });

      // Chama o back: DELETE /api/favorite-items/{favoriteRecordId}/
      try {
        await apiFetch(`${endpoint}${favoriteRecordId}/`, { method: "DELETE" });
      } catch (err) {
        // Se falhar, reverte visualmente
        setMap((prev) => new Map(prev).set(id, favoriteRecordId));
      }
    } else {
      // Favoritar — atualiza visualmente antes (otimista)
      setMap((prev) => new Map(prev).set(id, null)); // null temporário até o back responder

      try {
        // POST /api/favorite-items/ com body { item: id }
        const res = await apiFetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ [bodyKey]: id }),
        });

        if (res.ok) {
          const data = await res.json();
          // Atualiza o Map com o id real do registro criado
          setMap((prev) => new Map(prev).set(id, data.id));
        } else {
          // Reverte se o back recusar (ex: já favoritado)
          setMap((prev) => {
            const next = new Map(prev);
            next.delete(id);
            return next;
          });
        }
      } catch (err) {
        setMap((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      }
    }
  };

  const handleSearch = () => {
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    navigate(`/busca?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="navbar-avatar" onClick={() => profileId && navigate(`/perfil/${profileId}`)}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Perfil"
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        <div className="navbar-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="O que você procura?"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <button className="navbar-search-submit" onClick={handleSearch} aria-label="Buscar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c2185b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <button className="navbar-settings" aria-label="Configurações" onClick={() => navigate("/configuracoes")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </nav>

      <main className="main-content">
        {loading && <p style={{ textAlign: "center", padding: 32 }}>Carregando...</p>}
        {error && <p style={{ textAlign: "center", color: "#e91e8c", padding: 32 }}>{error}</p>}

        {!loading && !error && (
          <>
            <section className="section">
              <h2 className="section-title">Itens Populares</h2>
              {items.length === 0 ? (
                <p style={{ color: "#aaa", padding: "0 24px" }}>Nenhum item encontrado.</p>
              ) : (
                <HorizontalScroll>
                  {items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      favoriteItems={favoriteItems}
                      onToggleFavorite={handleToggleFavorite}
                      collectionNameMap={collectionNameMap} // 🆕
                    />
                  ))}
                </HorizontalScroll>
              )}
            </section>

            <section className="section">
              <h2 className="section-title">Coleções Populares</h2>
              {collections.length === 0 ? (
                <p style={{ color: "#aaa", padding: "0 24px" }}>Nenhuma coleção encontrada.</p>
              ) : (
                <HorizontalScroll>
                  {collections.map((col) => (
                    <CollectionCard
                      key={col.id}
                      collection={col}
                      favoriteCollections={favoriteCollections}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </HorizontalScroll>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
