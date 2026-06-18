import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./BuscaItemColecao.css";

// ============================================================
// DADOS MOCKADOS — substituir quando o back estiver pronto
//
// TODO: remover mockResults e substituir por chamada à API:
//
// const [items, setItems] = useState([])
// const [collections, setCollections] = useState([])
//
// useEffect(() => {
//   if (!query) return;
//   setLoading(true);
//   fetch(`url-da-api/busca/?q=${encodeURIComponent(query)}`)
//     .then(res => res.json())
//     .then(data => {
//       setItems(data.items);           // lista de itens que batem com o termo
//       setCollections(data.collections); // lista de coleções que batem com o termo
//       setLoading(false);
//     })
//     .catch(() => setLoading(false));
// }, [query]);
//
// O back vai retornar um objeto com duas listas:
// {
//   items: [{ id, name, collection, image }],
//   collections: [{ id, name, owner, hearts, images }]
// }
//
// Se nenhum registro for encontrado, o back retorna listas vazias:
// { items: [], collections: [] }
// → o front detecta isso via hasResults = false e exibe a mensagem amigável
// ============================================================

// Dados mockados usados enquanto o back não está pronto.
// Representam o formato exato que a API vai retornar.
const mockResults = {
    items: [
    { id: 1, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+1" },
    { id: 2, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+2" },
    { id: 3, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+3" },
    { id: 4, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+4" },
    { id: 5, name: "Hello Kitty - McDonalds 2025", collection: "McDonalds", image: "https://placehold.co/200x200/fce4ec/c2185b?text=HK+5" },
],
    collections: [
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
    ],
};

// Mesma função usada na HomePage e UserProfilePage
// Converte números >= 1000 para formato curto: 2000 → "2k"
function formatHearts(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
    return n;
}

// Ícone de coração — filled true = cheio (rosa), filled false = vazio (cinza)
// Mesmo componente do padrão adotado na HomePage
function HeartIcon({ filled }) {
    if (filled) {
        return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#e91e8c">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        );
    }
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

// ============================================================
// Card de Item — exibe imagem, nome, coleção e botão de favoritar
// Recebe um item com: { id, name, collection, image }
// ============================================================
function ItemCard({ item }) {
    // favorited: controla visualmente se o coração está cheio ou vazio
    // TODO: quando o back estiver pronto, o valor inicial virá da API (item.favoritado)
    const [favorited, setFavorited] = useState(false);
    const navigate = useNavigate();

    return (
        // Clique no card inteiro navega para a página do item
        <div
            className="sr-item-card"
            onClick={() => navigate(`/item/${item.id}`)}
    >
        {/* Imagem do item — item.image será a URL real vinda do banco */}
        <div className="sr-item-image">
            <img src={item.image} alt={item.name} />
        </div>

        <div className="sr-item-info">
            <div>
                {/* item.name e item.collection virão do banco com os valores reais */}
                <p className="sr-item-name">{item.name}</p>
                <p className="sr-item-collection">Coleção: {item.collection}</p>
            </div>

        {/* Botão de favoritar — stopPropagation evita navegar ao clicar no coração */}
        {/* TODO: quando o back estiver pronto, além de mudar visualmente, chamar a API:
            fetch('url-da-api/favoritar/item/' + item.id, { method: 'POST' }) */}
        <button
            className="sr-heart-btn"
            onClick={(e) => {
                e.stopPropagation(); // impede que o clique no coração abra a página do item
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

// ============================================================
// Card de Coleção — exibe grade de até 4 imagens, nome, dono, coração e contagem
// Recebe uma coleção com: { id, name, owner, hearts, images }
// ============================================================
function CollectionCard({ collection }) {
    // favorited: controla visualmente se o coração está cheio ou vazio
    // TODO: quando o back estiver pronto, o valor inicial virá da API (collection.favoritado)
    const [favorited, setFavorited] = useState(false);
    const navigate = useNavigate();

    return (
        // Clique no card inteiro navega para a página da coleção
    <div
        className="sr-collection-card"
        onClick={() => navigate(`/colecao/${collection.id}`)}
    >
        {/* Grade de até 4 imagens — se não houver imagens, exibe bloco cinza vazio */}
        {/* collection.images virá do back como lista de URLs */}
        {collection.images.length > 0 ? (
        <div className="sr-collection-grid">
            {collection.images.slice(0, 4).map((img, i) => (
                <img key={i} src={img} alt="" />
            ))}
        </div>
        ) : (
        <div className="sr-collection-empty" />
        )}

        <div className="sr-collection-info">
            <div>
                {/* collection.name e collection.owner virão do banco com os valores reais */}
                <p className="sr-collection-name">{collection.name}</p>
                <p className="sr-collection-owner">{collection.owner}</p>
            </div>

        <div className="sr-collection-hearts">
                {/* Botão de favoritar — stopPropagation evita navegar ao clicar no coração */}
                {/* TODO: quando o back estiver pronto, além de mudar visualmente, chamar a API:
                    fetch('url-da-api/favoritar/colecao/' + collection.id, { method: 'POST' }) */}
            <button
            className="sr-heart-btn"
            onClick={(e) => {
                e.stopPropagation(); // impede que o clique no coração abra a página da coleção
                setFavorited(!favorited);
            }}
            aria-label={favorited ? "Desfavoritar" : "Favoritar"}
        >
                <HeartIcon filled={favorited} />
            </button>

            {/* collection.hearts virá do back como número inteiro — formatHearts exibe "2k" etc. */}
            <span className="sr-hearts-count">{formatHearts(collection.hearts)}</span>
            </div>
        </div>
    </div>
  );
}

// ============================================================
// Componente principal — página de resultados de busca
//
// Fluxo completo:
// 1. Usuário digita na HomePage e pressiona Enter ou clica na seta
// 2. HomePage navega para /busca?q=termo
// 3. useSearchParams lê o ?q= da URL → vira o estado `query`
// 4. useEffect reage ao `query` e busca os dados (mock por enquanto, API depois)
// 5. Resultados são separados em duas seções: Itens e Coleções
// 6. Se não houver resultados → mensagem amigável
// 7. Se o usuário buscar novamente pela navbar desta página → URL muda → useEffect roda de novo
// ============================================================
export default function BuscaItemColecao() {
    // useSearchParams: lê e escreve os parâmetros da URL (?q=...)
    // setSearchParams: atualiza a URL quando o usuário busca de novo dentro desta página
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // query: termo lido da URL — ex: /busca?q=hello → query = "hello"
    // É a fonte da verdade: quando a URL muda, o useEffect abaixo reage automaticamente
    const query = searchParams.get("q") || "";

    // inputValue: controla o texto digitado na barra de busca desta página
    // Começa igual ao query da URL, mas pode ser editado antes de disparar nova busca
    const [inputValue, setInputValue] = useState(query);

    // items e collections: resultados que chegam da API (ou do mock por enquanto)
    // TODO: substituir pelos dados reais vindos da API quando o back estiver pronto
    const [items, setItems] = useState([]);
    const [collections, setCollections] = useState([]);

    // loading: true enquanto aguarda resposta da API — exibe os três pontinhos animados
    const [loading, setLoading] = useState(false);

    // ============================================================
    // useEffect: roda toda vez que o `query` (URL) muda
    // É aqui que a chamada à API vai acontecer quando o back estiver pronto.
    //
    // Com o back:
    // - Trocar o bloco do setTimeout pelo fetch real (ver TODO no topo do arquivo)
    // - Remover mockResults completamente
    // - O back filtra por nome (insensível a maiúsculas/minúsculas, busca parcial)
    //   então não será necessário fazer o .filter() no front — só setar o retorno da API
    // ============================================================
    useEffect(() => {
        // Se o campo estiver vazio, limpa os resultados e não faz nada
        if (!query.trim()) {
            setItems([]);
            setCollections([]);
            return;
    }

    setLoading(true);

    // Simulação de delay de rede (300ms) — imita o tempo de resposta da API
    // TODO: remover este setTimeout e substituir pelo fetch real quando o back estiver pronto
    const timer = setTimeout(() => {
        const term = query.toLowerCase();

        // Filtra os mocks simulando a busca parcial e insensível a maiúsculas que o back fará
        // Com o back: esse filtro some — os dados já chegam filtrados da API
        const filteredItems = mockResults.items.filter(
            (i) => i.name.toLowerCase().includes(term) || i.collection.toLowerCase().includes(term)
            );
        const filteredCollections = mockResults.collections.filter(
            (c) => c.name.toLowerCase().includes(term)
            );

        setItems(filteredItems);
        setCollections(filteredCollections);
        setLoading(false);
    }, 300);

    // Cleanup: cancela o timer se o usuário digitar antes dos 300ms acabarem
    // Isso evita chamadas desnecessárias à API enquanto o usuário ainda está digitando
    return () => clearTimeout(timer);
}, [query]); // ← roda de novo sempre que a URL ?q= mudar

    // Dispara a busca: atualiza o ?q= na URL → useEffect reage automaticamente
    // Não faz fetch direto — quem faz fetch é sempre o useEffect, reagindo à URL
    const handleSearch = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return; // não busca se o campo estiver vazio
        setSearchParams({ q: trimmed }); // → URL vira /busca?q=trimmed → useEffect roda
    };

    // Dispara a busca ao pressionar Enter (critério de aceite do front)
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    // hasResults: true se houver ao menos 1 item OU 1 coleção
    // Usado para decidir entre mostrar resultados ou mensagem de "nenhum resultado"
    const hasResults = items.length > 0 || collections.length > 0;

    return (
    <div className="sr-page">

        {/* ── Navbar — mesma estrutura da HomePage ── */}
        <nav className="sr-navbar">

            {/* Botão de voltar para a página anterior — mesmo padrão do ItemPage e ColectionPage */}
            <button
            className="sr-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
            </svg>
            </button>

        {/* Barra de busca — pré-preenchida com o termo que gerou esta página
            O usuário pode editar e pressionar Enter ou clicar na seta para nova busca */}
        <div className="sr-navbar-search">
            {/* Ícone de lupa decorativo (não clicável) — mesmo da HomePage */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

            {/* Campo de texto — autoFocus coloca o cursor aqui ao abrir a página */}
        <input
            placeholder="O que você procura?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown} // dispara busca ao pressionar Enter
            autoFocus
        />

        {/* Seta clicável para disparar a busca (critério de aceite: "ícone de lupa") */}
        <button className="sr-search-submit" onClick={handleSearch} aria-label="Buscar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2185b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </button>
        </div>

        {/* Botão de configurações — mesmo da HomePage */}
        <button className="sr-navbar-settings" aria-label="Configurações">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        </button>
        </nav>

    {/* ── Conteúdo principal ── */}
    <main className="sr-main">

        {/* Texto "Resultados para: 'termo'" — só aparece se houver um query na URL */}
        {query.trim() !== "" && (
            <p className="sr-query-label">
                Resultados para: <strong>"{query}"</strong>
            </p>
        )}

        {/* ── Estado de loading — três pontinhos animados ──
            Aparece enquanto aguarda a resposta da API (ou do mock com delay) */}
        {loading && (
            <div className="sr-loading">
                <div className="sr-loading-dot" />
                <div className="sr-loading-dot" />
                <div className="sr-loading-dot" />
            </div>
        )}

        {/* ── Estado vazio — mensagem amigável ──
            Aparece quando: não está carregando + tem query + API retornou listas vazias
            Critério de aceite: "se o back retornar lista vazia, exibir mensagem amigável" */}
        {!loading && query.trim() !== "" && !hasResults && (
            <div className="sr-empty">
                {/* Ícone de lupa esmaecido para reforçar visualmente o "não encontrado" */}
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p className="sr-empty-title">Nenhum resultado encontrado</p>
                <p className="sr-empty-subtitle">Tente pesquisar com outras palavras.</p>
            </div>
        )}

        {/* ── Resultados — duas seções separadas: Itens e Coleções ──
            Cada seção só aparece se tiver pelo menos 1 resultado daquele tipo.
            Assim, se a busca retornar só itens, a seção de coleções não aparece (e vice-versa). */}
        {!loading && hasResults && (
        <>
            {/* Seção de Itens */}
            {items.length > 0 && (
                <section className="sr-section">
                    <h2 className="sr-section-title">Itens</h2>
                    {/* Grid responsivo — número de colunas se adapta ao tamanho da tela */}
                    {/* TODO: trocar mockItems por items vindos da API */}
                    <div className="sr-items-grid">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                    </div>
                </section>
            )}

            {/* Seção de Coleções */}
            {collections.length > 0 && (
                <section className="sr-section">
                <h2 className="sr-section-title">Coleções</h2>
                {/* Grid responsivo — mesmo padrão da seção de itens */}
                {/* TODO: trocar mockCollections por collections vindos da API */}
                <div className="sr-collections-grid">
                    {collections.map((col) => (
                        <CollectionCard key={col.id} collection={col} />
                    ))}
                </div>
                </section>
            )}
        </>
        )}
    </main>
    </div>
);
}