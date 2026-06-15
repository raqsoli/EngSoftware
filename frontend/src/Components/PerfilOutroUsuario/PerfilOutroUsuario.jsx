import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PerfilOutroUsuario.css";

// ============================================================
// DADOS MOCKADOS — substituir quando o back estiver pronto
// TODO: remover mockUser e substituir por chamada à API:
// const [user, setUser] = useState(null)
// useEffect(() => {
//   fetch('url-da-api/usuario/' + id)
//     .then(res => res.json())
//     .then(data => setUser(data))
// }, [id])
// O back vai retornar: id, name, avatar, totalItems, totalCollections
// ============================================================
const mockUser = {
  id: 2,
  name: "AmoHelloKitty123",
  avatar: "https://placehold.co/70x70/fce4ec/c2185b?text=A",
  totalItems: 3,
  totalCollections: 1,
};

// ============================================================
// TODO: substituir por chamada à API:
// fetch('url-da-api/usuario/' + id + '/itens')
// ============================================================
const mockItems = [
  { id: 1, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+1" },
  { id: 2, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+2" },
  { id: 3, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+3" },
];

// ============================================================
// TODO: substituir por chamada à API:
// fetch('url-da-api/usuario/' + id + '/colecoes')
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
// TODO: substituir por chamada à API:
// fetch('url-da-api/usuario/' + id + '/favoritos/itens')
// ============================================================
const mockFavoriteItems = [
  { id: 1, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=Fav+1" },
  { id: 2, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=Fav+2" },
];

// ============================================================
// TODO: substituir por chamada à API:
// fetch('url-da-api/usuario/' + id + '/favoritos/colecoes')
// ============================================================
const mockFavoriteCollections = [
  { id: 3, name: "Coleção Favoritada", owner: "Outro Usuário", hearts: 500, images: [] },
];

function formatHearts(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return n;
}

// Card de item — com coração para favoritar (inicialmente vazio)
function ItemCard({ item }) {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(false);

  return (
    <div className="other-item-card" onClick={() => navigate(`/item/${item.id}`)}>
      <div className="other-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="other-item-info">
        <div>
          <p className="other-item-name">{item.name}</p>
          <p className="other-item-collection">Coleção: {item.collection}</p>
        </div>
        {/* Coração para favoritar — inicialmente vazio */}
        {/* TODO: ao clicar, salvar no banco: fetch('url-da-api/favoritar/item/' + item.id, { method: 'POST' }) */}
        <button
          className="other-heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            setFavorited(!favorited);
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

// Card de coleção — com coração para favoritar (inicialmente vazio)
function CollectionCard({ collection }) {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(false);

  return (
    <div className="other-collection-card" onClick={() => navigate(`/colecao/${collection.id}`)}>
      {collection.images.length > 0 ? (
        <div className="other-collection-grid">
          {collection.images.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt="" />
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
        {/* Coração para favoritar — inicialmente vazio */}
        {/* TODO: ao clicar, salvar no banco: fetch('url-da-api/favoritar/colecao/' + collection.id, { method: 'POST' }) */}
        <button
          className="other-heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            setFavorited(!favorited);
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

export default function OtherUserProfilePage() {
  const { id } = useParams(); // id do usuário da URL — ex: /perfil-usuario/2
  const navigate = useNavigate();

  // Controla qual aba está ativa
  const [activeTab, setActiveTab] = useState("itens");

  return (
    <div className="other-profile-page">

      {/* Cabeçalho */}
      <header className="other-profile-header">
        <button
          className="other-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      {/* Informações do usuário — sem botão editar */}
      <div className="other-profile-info">
        <div className="other-profile-info-left">
          {/* TODO: avatar virá do back */}
          <img className="other-profile-avatar" src={mockUser.avatar} alt={mockUser.name} />
          <p className="other-profile-name">{mockUser.name}</p>
        </div>

        {/* Contadores de itens e coleções */}
        <div className="other-profile-stats">
          <div className="other-profile-stat">
            <span className="other-profile-stat-label">Itens</span>
            {/* TODO: totalItems virá do back */}
            <span className="other-profile-stat-value">{mockUser.totalItems}</span>
          </div>
          <div className="other-profile-stat-divider" />
          <div className="other-profile-stat">
            <span className="other-profile-stat-label">Coleções</span>
            {/* TODO: totalCollections virá do back */}
            <span className="other-profile-stat-value">{mockUser.totalCollections}</span>
          </div>
        </div>
      </div>

      {/* Menu de abas */}
      <div className="other-profile-tabs">
        <button
          className={`other-profile-tab ${activeTab === "itens" ? "active" : ""}`}
          onClick={() => setActiveTab("itens")}
        >
          Itens
        </button>
        <button
          className={`other-profile-tab ${activeTab === "colecoes" ? "active" : ""}`}
          onClick={() => setActiveTab("colecoes")}
        >
          Coleções
        </button>
        <button
          className={`other-profile-tab ${activeTab === "favoritos" ? "active" : ""}`}
          onClick={() => setActiveTab("favoritos")}
        >
          Favoritos
        </button>
      </div>

      {/* Conteúdo das abas */}
      <main className="other-profile-content">

        {/* Aba Itens */}
        {activeTab === "itens" && (
          <section className="other-profile-section">
            <p className="other-section-title">Itens</p>
            {/* TODO: trocar mockItems por items vindo da API */}
            <div className="other-items-grid">
              {mockItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Aba Coleções */}
        {activeTab === "colecoes" && (
          <section className="other-profile-section">
            <p className="other-section-title">Coleções</p>
            {/* TODO: trocar mockCollections por collections vindo da API */}
            <div className="other-items-grid">
              {mockCollections.map((col) => (
                <CollectionCard key={col.id} collection={col} />
              ))}
            </div>
          </section>
        )}

        {/* Aba Favoritos */}
        {activeTab === "favoritos" && (
          <>
            <section className="other-profile-section">
              <p className="other-section-title">Itens favoritos</p>
              {/* TODO: trocar mockFavoriteItems por favoriteItems vindo da API */}
              <div className="other-items-grid">
                {mockFavoriteItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className="other-profile-section">
              <p className="other-section-title">Coleções favoritas</p>
              {/* TODO: trocar mockFavoriteCollections por favoriteCollections vindo da API */}
              <div className="other-items-grid">
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
