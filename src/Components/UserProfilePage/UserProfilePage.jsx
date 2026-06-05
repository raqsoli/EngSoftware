import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfilePage.css";

// ============================================================
// DADOS MOCKADOS — substituir quando o back estiver pronto
// TODO: remover mockUser e substituir por chamada à API:
// const [user, setUser] = useState(null)
// useEffect(() => {
//   fetch('url-da-api/usuario/perfil')
//     .then(res => res.json())
//     .then(data => setUser(data))
// }, [])
// O back vai retornar: id, name, avatar, totalItems, totalCollections
// ============================================================
const mockUser = {
  id: 1,
  name: "AmoHelloKitty123",
  avatar: "https://placehold.co/70x70/fce4ec/c2185b?text=A",
  // TODO: totalItems e totalCollections virão do back (contagem real do banco)
  totalItems: 3,
  totalCollections: 1,
};

// ============================================================
// TODO: remover mockItems e substituir por chamada à API:
// fetch('url-da-api/usuario/itens')
// O back vai retornar: id, name, collection, image, favorited
// ============================================================
const mockItems = [
  { id: 1, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+1", favorited: true },
  { id: 2, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+2", favorited: false },
  { id: 3, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+3", favorited: false },
];

// ============================================================
// TODO: remover mockCollections e substituir por chamada à API:
// fetch('url-da-api/usuario/colecoes')
// O back vai retornar: id, name, owner, hearts, images
// ============================================================
const mockCollections = [
  {
    id: 1,
    name: "McDonalds Maio 2025 (HK)",
    owner: "Nome do Dono",
    hearts: 2000,
    images: [
      "https://placehold.co/120x120/fce4ec/c2185b?text=HK+A",
      "https://placehold.co/120x120/f8bbd0/ad1457?text=HK+B",
      "https://placehold.co/120x120/f48fb1/880e4f?text=HK+C",
      "https://placehold.co/120x120/f06292/c2185b?text=HK+D",
    ],
  },
  { id: 2, name: "McDonalds Maio 2025 (HK)", owner: "Nome do Dono", hearts: 2000, images: [] },
  { id: 3, name: "McDonalds Maio 2025", owner: "Nome do Dono", hearts: 2000, images: [] },
];

// ============================================================
// TODO: remover mockFavoriteItems e substituir por chamada à API:
// fetch('url-da-api/usuario/favoritos/itens')
// ============================================================
const mockFavoriteItems = [
  { id: 1, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=Fav+1", favorited: true },
  { id: 2, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=Fav+2", favorited: true },
];

// ============================================================
// TODO: remover mockFavoriteCollections e substituir por chamada à API:
// fetch('url-da-api/usuario/favoritos/colecoes')
// ============================================================
const mockFavoriteCollections = [
  { id: 3, name: "Coleção Favoritada", owner: "Outro Usuário", hearts: 500, images: [] },
];

function formatHearts(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return n;
}

// Card de item do perfil — com ícone de editar
function ItemCard({ item }) {
  const navigate = useNavigate();

  return (
    <div className="profile-item-card" onClick={() => navigate(`/item/${item.id}`)}>
      <div className="profile-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="profile-item-info">
        <div>
          <p className="profile-item-name">{item.name}</p>
          <p className="profile-item-collection">Coleção: {item.collection}</p>
        </div>
        {/* Ícone de editar — leva para página de edição do item */}
        {/* TODO: criar a página /editar-item/:id */}
        <button
          className="profile-edit-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/editar-item/${item.id}`);
          }}
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

function CollectionCard({ collection }) {
  const navigate = useNavigate();

  return (
    <div className="profile-collection-card" onClick={() => navigate(`/colecao/${collection.id}`)}>
      {collection.images.length > 0 ? (
        <div className="profile-collection-grid">
          {collection.images.slice(0, 4).map((img, i) => (
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
        {/* Ícone de editar — leva para página de edição da coleção */}
        {/* TODO: criar a página /editar-colecao/:id */}
        <button
          className="profile-edit-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/editar-colecao/${collection.id}`);
          }}
          aria-label="Editar coleção"
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

// Scroll horizontal com seta
function HorizontalScroll({ children }) {
  const scrollRef = useRef(null);

  const scroll = () => {
    scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <div className="profile-scroll-wrapper">
      <div ref={scrollRef} className="profile-scroll-track">
        {children}
      </div>
      <button className="profile-arrow-btn" onClick={scroll} aria-label="Próximo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

// Card de item favorito — coração sempre cheio, ao clicar desfavorita
function FavoriteItemCard({ item }) {
  const [favorited, setFavorited] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="profile-item-card" onClick={() => navigate(`/item/${item.id}`)}>
      <div className="profile-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="profile-item-info">
        <div>
          <p className="profile-item-name">{item.name}</p>
          <p className="profile-item-collection">Coleção: {item.collection}</p>
        </div>
        <button
          className="profile-heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            setFavorited(!favorited);
            // TODO: quando o back estiver pronto, chamar API para desfavoritar
            // e remover o item da lista de favoritos:
            // fetch('url-da-api/desfavoritar/item/' + item.id, { method: 'DELETE' })
          }}
          aria-label={favorited ? "Desfavoritar" : "Favoritar"}
        >
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


export default function UserProfilePage() {
  const navigate = useNavigate();

  // Controla qual aba está ativa: "itens", "colecoes" ou "favoritos"
  const [activeTab, setActiveTab] = useState("itens");

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
          {/* TODO: avatar virá do back */}
          <img className="profile-avatar" src={mockUser.avatar} alt={mockUser.name} />
          <div>
            {/* TODO: name virá do back */}
            <p className="profile-name">{mockUser.name}</p>
            {/* Botão editar perfil — leva para a página de edição */}
            {/* TODO: criar a página /editar-perfil */}
            <button
              className="profile-edit-btn"
              onClick={() => navigate("/editar-perfil")}
            >
              editar perfil
            </button>
          </div>
        </div>

        {/* Contadores de itens e coleções */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-label">Itens</span>
            {/* TODO: totalItems virá do back */}
            <span className="profile-stat-value">{mockUser.totalItems}</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-label">Coleções</span>
            {/* TODO: totalCollections virá do back */}
            <span className="profile-stat-value">{mockUser.totalCollections}</span>
          </div>
        </div>
      </div>

      {/* Menu de abas */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "itens" ? "active" : ""}`}
          onClick={() => setActiveTab("itens")}
        >
          Itens
        </button>
        <button
          className={`profile-tab ${activeTab === "colecoes" ? "active" : ""}`}
          onClick={() => setActiveTab("colecoes")}
        >
          Coleções
        </button>
        <button
          className={`profile-tab ${activeTab === "favoritos" ? "active" : ""}`}
          onClick={() => setActiveTab("favoritos")}
        >
          Favoritos
        </button>
      </div>

      {/* Conteúdo das abas */}
      <main className="profile-content">

        {/* Aba Itens */}
        {activeTab === "itens" && (
          <section className="profile-section">
            <p className="profile-section-title">Seus itens</p>
            {/* Grid vertical com todos os itens + card de adicionar */}
            <div className="profile-items-grid">
              {/* TODO: trocar mockItems por items vindo da API */}
              {mockItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
              {/* Card de adicionar item */}
              {/* TODO: criar a página /adicionar-item */}
              <div
                className="profile-add-item-card"
                onClick={() => navigate("/adicionar-item")}
              >
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
              {/* TODO: trocar mockCollections por collections vindo da API */}
              {mockCollections.map((col) => (
                <CollectionCard key={col.id} collection={col} />
              ))}
              {/* Card de adicionar coleção */}
              {/* TODO: criar a página /adicionar-colecao */}
              <div
                className="profile-add-item-card"
                onClick={() => navigate("/adicionar-colecao")}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <p className="profile-add-item-label">AdicionarColeção</p>
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
                {/* TODO: trocar mockFavoriteItems por favoriteItems vindo da API */}
                {/* TODO: ao desfavoritar, chamar API e remover da lista */}
                {mockFavoriteItems.map((item) => (
                  <FavoriteItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className="profile-section">
              <p className="profile-section-title">Coleções favoritas</p>
              <div className="profile-items-grid">
                {/* TODO: trocar mockFavoriteCollections por favoriteCollections vindo da API */}
                {mockFavoriteCollections.map((col) => (
                  <CollectionCard key={col.id} collection={col} />
                ))}
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
