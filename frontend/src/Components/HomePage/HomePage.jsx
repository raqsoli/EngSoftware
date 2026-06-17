// useState: gerencia estados (ex: favorito ligado/desligado)
// useRef: controla o scroll horizontal da seta
// TODO: quando o back estiver pronto, adicionar useEffect
// useEffect será responsável por buscar os dados da API assim que a página carregar
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

// TODO: substituir por chamada à API quando o back estiver pronto
// remover mockItems e substituir por chamada à API:
// const [items, setItems] = useState([])
// useEffect(() => {
//   fetch('url-da-api/itens/populares')
//     .then(res => res.json())
//     .then(data => setItems(data))
// }, [])
// O back vai retornar uma lista com: id, name, collection, image
//página abre → useEffect roda → fetch busca dados na API
// → dados chegam → setItems preenche a lista → cards aparecem na tela
const mockItems = [
  { id: 1, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+1" },
  { id: 2, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+2" },
  { id: 3, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+3" },
  { id: 4, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+4" },
  { id: 5, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+5" },
];

// TODO: substituir por chamada à API quando o back estiver pronto
// DADOS MOCKADOS — substituir quando o back estiver pronto
// TODO: remover mockCollections e substituir por chamada à API:
// const [collections, setCollections] = useState([])
// useEffect(() => {
//   fetch('url-da-api/colecoes/populares')
//     .then(res => res.json())
//     .then(data => setCollections(data))
// }, [])
// O back vai retornar uma lista com: id, name, owner, hearts, images
const mockCollections = [
  {
    id: 1,
    name: "McDonalds Maio 2025 (HK)",
    owner: "Nome do Dono Coleção",
    hearts: 2000,
    images: [
        "https://placehold.co/120x120/fce4ec/c2185b?text=HK+A",
        "https://placehold.co/120x120/f8bbd0/ad1457?text=HK+B",
        "https://placehold.co/120x120/f48fb1/880e4f?text=HK+C",
        "https://placehold.co/120x120/f06292/c2185b?text=HK+D",
    ],
  },
  { id: 2, name: "Coleção 2", owner: "Dono 2", hearts: 340, images: [] },
  { id: 3, name: "Coleção 3", owner: "Dono 3", hearts: 120, images: [] },
  { id: 4, name: "Coleção 4", owner: "Dono 4", hearts: 88, images: [] },
];

//definir q vai aparecer inves de 2000 -> 2k (não muda com a vinda do back)
function formatHearts(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return n;
}

// (não muda com a vinda do back) ela se baseia no que o filled recebe, filled true coracao cheio, filled false coracao vazio, codigo do path é as coordernadas do icon
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

//essa função recebe os dados de um item especifico que virá da API
function ItemCard({ item }) {
  //hoje começa com false(coração vazio), mas com o back vai comecar com o valor real do banco 
  //useState(item.favoritado) // true ou false vindo do banco
  const [favorited, setFavorited] = useState(false);
  const navigate = useNavigate(); // adiciona isso
//na seguinte: - <img src={item.image} alt={item.name} /> item.image será a URL real da imagem cadastrada no banco. O item.imagem não muda
// essa linha nao muda so o valor que chega nela
//{item.name} e {item.collection}
//Com o back — virão do banco de dados com os nomes reais. Essa linha também não muda.

//linha 98 - onClick={() => setFavorited(!favorited)}
//Com o back — além de mudar visualmente, vai precisar chamar a API pra salvar no banco:
//onClick={() => {
//  setFavorited(!favorited) // continua mudando visualmente
//  fetch('url-da-api/favoritar/item/' + item.id, { method: 'POST' }) // novo: salva no banco
//}}
//fetch -> função do js que faz uma requisição para o servidor (pede ou envia uma ação para o back-end)
//url da api -> vai ter que me passar
///favoritar/item -> rota (que é um endereço que vc acessa para fazer alguma coisa no servidor)
//method: 'POST' cria ou envia algo novo para o banco
  return (
    <div 
        className="item-card"
        onClick={() => navigate(`/item/${item.id}`)}
        style={{ cursor: 'pointer' }}
    >
      <div className="item-card-image">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="item-card-info">
        <div>
          <p className="item-card-name">{item.name}</p>
          <p className="item-card-collection">Coleção: {item.collection}</p>
        </div>
        <button
          className="heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            setFavorited(!favorited);
          }}
          aria-label={favorited ? "Desfavoritar" : "Favoritar"}
        >
          <HeartIcon filled={favorited} />
        </button>
      </div>
    </div>
  );
}

// Card de cada coleção — recebe os dados da coleção como prop
function CollectionCard({ collection }) {
    // favorited: controla visualmente se o coração está cheio ou vazio
    // TODO: quando o back estiver pronto, o valor inicial virá da API
  const [favorited, setFavorited] = useState(false);
  const navigate = useNavigate();
    //collection.images são do back
  return (
    <div
      className="collection-card"
      // Ao clicar na coleção, navega para a página da coleção
      // TODO: a página /colecao/:id vai buscar os dados dessa coleção no back
      onClick={() => navigate(`/colecao/${collection.id}`)}
    >
      {collection.images.length > 0 ? (
        <div className="collection-img-grid">
          {collection.images.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt="" />
          ))}
        </div>
      ) : (
        // Exibe um bloco vazio quando não há imagens ainda
        <div className="collection-empty" />
      )}

      <div className="collection-card-info">
        <div>
            {/* collection.name e collection.owner: dados que virão do back */}
          <p className="collection-card-name">{collection.name}</p>
          <p className="collection-card-owner">{collection.owner}</p>
        </div>
        <div className="collection-hearts">
          <button
            className="heart-btn"
            onClick={(e) => {
              e.stopPropagation();
              setFavorited(!favorited); //so muda o coracao na tela
              //fetch('url-da-api/favoritar/colecao/' + collection.id, { method: 'POST' }) // novo: avisa o banco
            }}
            aria-label={favorited ? "Desfavoritar" : "Favoritar"} //acessibilidade?
          >
            <HeartIcon filled={favorited} />
          </button>
          <span className="hearts-count">{formatHearts(collection.hearts)}</span>
        </div>
      </div>
    </div>
  );
} //o valor de collection hearts ali de cima hoje vem do mock mas depois vai vir do back

// Componente de scroll horizontal com seta
// useRef: mantém referência da div para controlar o scroll programaticamente
// Não muda com o back — é 100% visual
function HorizontalScroll({ children }) {
// isso fica, é só pra mover a lista quando clicar na seta
  const ref = useRef(null);

  const scroll = () => {
    ref.current?.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <div className="scroll-wrapper">
      <div ref={ref} className="scroll-track">
        {children}
      </div>
      <button className="arrow-btn" onClick={scroll} aria-label="Próximo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Navbar fixa no topo*/}
      <nav className="navbar">

        {/* Avatar do usuário logado */}
        {/* TODO: quando o back estiver pronto, exibir a foto real do usuário */}
        <div className="navbar-avatar" onClick={() => navigate('/perfil/1')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        {/* Barra de busca */}
        {/* TODO: quando o back estiver pronto, chamar a API com o texto digitado */}
        <div className="navbar-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input placeholder="O que você procura?" />
        </div>

        {/* Botão de configurações */}
        <button className="navbar-settings" aria-label="Configurações">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </nav>

      {/* Conteúdo
       mockItems tem 5 itens
        → map percorre os 5
        → cria 5 ItemCards automaticamente 
         com o BACK: {items.map((item) => (
        <ItemCard key={item.id} item={item} />
        ))} 
         item={item} -> Passa os dados daquele item específico para dentro do ItemCard*/}
      <main className="main-content">
        <section className="section">
          <h2 className="section-title">Itens Populares</h2>
          <HorizontalScroll>
            {/* TODO: trocar mockItems por items vindo da API */}
            {mockItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </HorizontalScroll>
        </section>

        <section className="section">
          <h2 className="section-title">Coleções Populares</h2>
          <HorizontalScroll>
            {/* TODO: trocar mockCollections por collections vindo da API */}
            {mockCollections.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </HorizontalScroll>
        </section>
      </main>
    </div>
  );
}