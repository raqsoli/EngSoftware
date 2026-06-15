import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ItemPage.css";

// DADOS MOCKADOS — substituir quando o back estiver pronto
// TODO: remover mockItem e substituir por chamada à API:
// const [item, setItem] = useState(null)
// useEffect(() => {
//   fetch('url-da-api/item/' + id)
//     .then(res => res.json())
//     .then(data => setItem(data))
// }, [id])
// O back vai retornar: id, name, collection, description, images, owner

const mockItem = {
  id: 1,
  name: "Hello Kit - McDonalds 2025",
  collection: "McDonalds",
  collectionId: 1,
  description: "Aqui vai aparecer a descrição do item",
  // TODO: images é uma lista de URLs de imagens do item vindas do back
  images: [
    "https://placehold.co/300x300/fce4ec/c2185b?text=Imagem+1",
    "https://placehold.co/300x300/f8bbd0/ad1457?text=Imagem+2",
    "https://placehold.co/300x300/f48fb1/880e4f?text=Imagem+3",
  ],
  // TODO: owner virá do back com os dados do dono da coleção
  owner: {
    id: 1,
    name: "HelloKitty123",
    avatar: "https://placehold.co/40x40/fce4ec/c2185b?text=A",
  },
};

export default function ItemPage() {
  // useParams pega o id da URL — ex: /item/1 → id = "1"
  // TODO: usar o id para buscar o item correto na API
  const { id } = useParams();

  const navigate = useNavigate();

  // Controla qual imagem está sendo exibida no momento
  const [currentImage, setCurrentImage] = useState(0);

  // Favorito — só visual por enquanto
  // TODO: quando o back estiver pronto, o valor inicial virá da API
  // TODO: ao clicar, salvar no banco: fetch('url-da-api/favoritar/item/' + id, { method: 'POST' })
  const [favorited, setFavorited] = useState(false);

  // Passa para a próxima imagem — volta para a primeira se chegar no fim
  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === mockItem.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="item-page">

      {/* Cabeçalho com título e botão de voltar */}
      <header className="item-page-header">
        <button
          className="back-btn"
          // Volta para a página anterior
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </header>

      {/* Conteúdo principal */}
      <main className="item-page-main">

        {/* Nome do item e dono da coleção */}
        <div className="item-top-info">
          <div>
            {/* TODO: item.name e item.collection virão do back */}
            <h2 className="item-name">{mockItem.name}</h2>
            <p className="item-collection"
            // Ao clicar na coleção, navega para a página da coleção
            onClick={() => navigate(`/colecao/${mockItem.collectionId}`)}> Coleção: {mockItem.collection}</p>
          </div>

          {/* Dono da coleção — ao clicar vai para o perfil dele */}
          {/* TODO: owner.name e owner.avatar virão do back */}
          {/* TODO: criar a página /perfil/:id e linkar aqui */}
          <div
            className="item-owner"
            onClick={() => navigate(`/perfil-usuario/${mockItem.owner.id}`)}
            style={{ cursor: "pointer" }}
          >
            <span className="item-owner-name">{mockItem.owner.name}</span>
            <img
              className="item-owner-avatar"
              src={mockItem.owner.avatar}
              alt={mockItem.owner.name}
            />
          </div>
        </div>

        {/* Galeria de imagens do item */}
        <div className="item-gallery">

          {/* Imagem atual */}
          {/* TODO: mockItem.images são URLs vindas do back */}
          <img
            className="item-gallery-image"
            src={mockItem.images[currentImage]}
            alt={mockItem.name}
          />

          {/* Seta para próxima imagem — só aparece se tiver mais de 1 imagem */}
          {mockItem.images.length > 1 && (
            <button
              className="gallery-arrow"
              onClick={nextImage}
              aria-label="Próxima imagem"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Botão de favoritar */}
          {/* TODO: quando o back estiver pronto, salvar no banco ao clicar */}
          <button
            className="item-heart-btn"
            onClick={() => setFavorited(!favorited)}
            aria-label={favorited ? "Desfavoritar" : "Favoritar"}
          >
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

          {/* Indicador de qual imagem está sendo exibida (pontos) */}
          {mockItem.images.length > 1 && (
            <div className="gallery-dots">
              {mockItem.images.map((_, i) => (
                <span
                  key={i}
                  className={`gallery-dot ${i === currentImage ? "active" : ""}`}
                  onClick={() => setCurrentImage(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Descrição do item */}
        <div className="item-description">
          <p className="item-description-label">Descrição</p>
          {/* TODO: mockItem.description virá do back */}
          <div className="item-description-box">
            {mockItem.description || ""}
          </div>
        </div>

      </main>
    </div>
  );
}
