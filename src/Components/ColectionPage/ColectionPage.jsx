import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ColectionPage.css";

// DADOS MOCKADOS — substituir quando o back estiver pronto
// TODO: remover mockCollection e substituir por chamada à API:
// const [collection, setCollection] = useState(null)
// useEffect(() => {
//   fetch('url-da-api/colecao/' + id)
//     .then(res => res.json())
//     .then(data => setCollection(data))
// }, [id])
// O back vai retornar: id, name, description, items, owner, favorited

const mockCollection = {
  id: 1,
  name: "Hello Kit - McDonalds 2025",
  description: "Aqui vai aparecer a descrição da coleção",
  // TODO: owner virá do back com os dados do dono da coleção
  owner: {
    id: 1,
    name: "HelloKitty123",
    avatar: "https://placehold.co/40x40/fce4ec/c2185b?text=A",
  },
  // TODO: items é uma lista de itens da coleção vindos do back
  items: [
    { id: 1, name: "Hello Kitty - McDonalds 2025", image: "https://placehold.co/300x300/fce4ec/c2185b?text=Item+1" },
    { id: 2, name: "Hello Kitty - McDonalds 2025", image: "https://placehold.co/300x300/f8bbd0/ad1457?text=Item+2" },
    { id: 3, name: "Hello Kitty - McDonalds 2025", image: "https://placehold.co/300x300/f48fb1/880e4f?text=Item+3" },
    { id: 4, name: "Hello Kitty - McDonalds 2025", image: "https://placehold.co/300x300/fce4ec/c2185b?text=Item+4" },
    { id: 5, name: "Hello Kitty - McDonalds 2025", image: "https://placehold.co/300x300/f8bbd0/ad1457?text=Item+5" },
    { id: 6, name: "Hello Kitty - McDonalds 2025", image: "https://placehold.co/300x300/f48fb1/880e4f?text=Item+6" },
  ],
};

export default function CollectionPage() {
  // useParams pega o id da URL — ex: /colecao/1 → id = "1"
  // TODO: usar o id para buscar a coleção correta na API
  const { id } = useParams();

  const navigate = useNavigate();

  // Favorito — só visual por enquanto
  // TODO: quando o back estiver pronto, o valor inicial virá da API
  // TODO: ao clicar, salvar no banco: fetch('url-da-api/favoritar/colecao/' + id, { method: 'POST' })
  const [favorited, setFavorited] = useState(false);

  return (
    <div className="collection-page">

      {/* Cabeçalho: seta de voltar + título "Visualizar Coleção" lado a lado */}
      <header className="collection-page-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      {/* Conteúdo principal com scroll */}
      <main className="collection-page-main">

        {/* Nome da coleção, favorito e dono */}
        <div className="collection-top-info">
          <div className="collection-title-row">
            <h2 className="collection-name">{mockCollection.name}</h2>

            {/* Botão de favoritar a coleção */}
            {/* TODO: quando o back estiver pronto, salvar no banco ao clicar */}
            <button
              className="collection-heart-btn"
              onClick={() => setFavorited(!favorited)}
              aria-label={favorited ? "Desfavoritar" : "Favoritar"}
            >
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

          {/* Dono da coleção */}
          {/* TODO: quando a página de perfil de outro usuário estiver pronta,
               trocar o comentário abaixo e habilitar o navigate:
               onClick={() => navigate(`/perfil/${mockCollection.owner.id}`)} */}
          <div className="collection-owner">
            <span className="collection-owner-name">{mockCollection.owner.name}</span>
            <img
              className="collection-owner-avatar"
              src={mockCollection.owner.avatar}
              alt={mockCollection.owner.name}
            />
          </div>
        </div>

        {/* Grid de itens da coleção */}
        <div className="collection-grid">
          {mockCollection.items.map((item) => (
            <div
              key={item.id}
              className="collection-item-card"
              // Ao clicar no item, navega para a página do item já implementada
              onClick={() => navigate(`/item/${item.id}`)}
            >
              <div className="collection-item-image-wrapper">
                <img
                  className="collection-item-image"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <p className="collection-item-name">{item.name}</p>
            </div>
          ))}
        </div>

        {/* Descrição da coleção */}
        <div className="collection-description">
          <p className="collection-description-label">Descrição</p>
          {/* TODO: mockCollection.description virá do back */}
          <div className="collection-description-box">
            {mockCollection.description || ""}
          </div>
        </div>

      </main>
    </div>
  );
}
