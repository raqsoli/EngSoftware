# EngSoftware — Colecionáveis

Projeto da matéria de Engenharia de Software da UTFPR para catalogação e organização de itens colecionáveis em coleções pessoais, com favoritos e perfis de usuário.

- **Backend:** Django + Django REST Framework
- **Frontend:** React + Vite

---

## Estrutura de pastas

```
EngSoftware/
├── backend/
│   ├── collections_app/       # App: coleções (Collection)
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── items/                 # App: itens e imagens dos itens (Item, ItemImage)
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── favorites/             # App: favoritos (FavoriteItem, FavoriteCollection)
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── users/                 # App: usuários e perfil (Profile)
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── permissions.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── config/                 # Configuração do projeto Django
│   │   ├── settings.py
│   │   ├── urls.py             # Junta as rotas de todos os apps
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── media/                  # Uploads (avatares e imagens de itens)
│   ├── venv/                   # Ambiente virtual Python (não versionado)
│   ├── db.sqlite3              # Banco de dados local (não versionado)
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── Components/         # Uma pasta por tela/feature, cada uma com .jsx + .css
    │   │   ├── AdicionarColecao/
    │   │   ├── AdicionarItem/
    │   │   ├── BuscaItemColecao/
    │   │   ├── CadastroUsuario/
    │   │   ├── ColectionPage/
    │   │   ├── Configuracoes/
    │   │   ├── EditarColecao/
    │   │   ├── EditarItem/
    │   │   ├── EditarPerfil/
    │   │   ├── Excluirconta/
    │   │   ├── HomePage/
    │   │   ├── ItemPage/
    │   │   ├── Login/
    │   │   ├── PerfilOutroUsuario/
    │   │   └── UserProfilePage/
    │   ├── api.js               # Configuração de fetch, tokens e API_BASE_URL
    │   ├── App.jsx               # Definição das rotas (react-router-dom)
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Como rodar o backend (Django)

Pré-requisitos: Python 3.10+ instalado.

```bash
cd backend

# Ativar o ambiente virtual (se ainda não existir, criar com: python -m venv venv)
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Aplicar migrações no banco
python manage.py migrate

# (Opcional) criar um super usuário para acessar o /admin/
python manage.py createsuperuser

# Rodar o servidor
python manage.py runserver
```

O backend sobe por padrão em **`http://127.0.0.1:8000`**.

Painel administrativo do Django: `http://127.0.0.1:8000/admin/`

---

## Como rodar o frontend (React + Vite)

Pré-requisitos: Node.js instalado.

```bash
cd frontend

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

O frontend sobe por padrão em **`http://localhost:5173`** e já está configurado (em `src/api.js`, constante `API_BASE_URL`) para consumir a API em `http://127.0.0.1:8000`.

> Importante: o backend precisa estar rodando **antes** (ou ao mesmo tempo) para o frontend conseguir buscar dados.

---

## Autenticação

A API usa **JWT** (`rest_framework_simplejwt`). O fluxo básico:

1. `POST /api/token/` com `{ "username": "...", "password": "..." }` → retorna `access` e `refresh`.
2. O frontend guarda esses tokens no `localStorage` (via `salvarTokens` em `api.js`).
3. Toda requisição autenticada envia o header `Authorization: Bearer <access_token>`
   (feito automaticamente pela função `apiFetch` em `api.js`).
4. `POST /api/token/refresh/` com `{ "refresh": "..." }` → gera um novo `access` quando o atual expira.

---

## Endpoints da API

Base URL: `http://127.0.0.1:8000/api/`

### Autenticação
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/token/` | Login — retorna tokens `access` e `refresh` |
| POST | `/api/token/refresh/` | Renova o `access` token |

### Usuários (`users`)
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/register/` | Cria uma nova conta |
| GET / PUT | `/api/profile/` | Vê/edita o perfil do usuário logado (autenticado) |
| GET | `/api/users/<id>/` | Perfil público de qualquer usuário (dados não sensíveis) |
| PUT | `/api/change-password/` | Troca a senha do usuário logado |
| DELETE | `/api/delete-account/` | Exclui a conta do usuário logado (requer senha no corpo da requisição) |

### Itens (`items`)
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/items/` | Lista itens (aceita filtros por query string, ex: `?owner=<id>`, `?collection=<id>`) |
| POST | `/api/items/` | Cria um item |
| GET | `/api/items/<id>/` | Detalhe de um item |
| PATCH | `/api/items/<id>/` | Edita um item |
| DELETE | `/api/items/<id>/` | Exclui um item |
| GET / POST | `/api/items/<id>/images/` | Lista ou adiciona imagens de um item |
| DELETE | `/api/item-images/<id>/` | Exclui uma imagem específica de um item |

### Coleções (`collections_app`)
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/collections/` | Lista coleções (aceita filtros por query string, ex: `?owner=<id>`) |
| POST | `/api/collections/` | Cria uma coleção |
| GET | `/api/collections/<id>/` | Detalhe de uma coleção |
| PATCH | `/api/collections/<id>/` | Edita uma coleção |
| DELETE | `/api/collections/<id>/` | Exclui uma coleção |

### Favoritos (`favorites`)
| Método | Endpoint | Descrição |
|---|---|---|
| GET / POST | `/api/favorite-items/` | Lista favoritos de itens do usuário logado / favorita um item (`{ "item_id": <id> }`) |
| DELETE | `/api/favorite-items/<id>/` | Remove um favorito de item (usa o id do **registro** de favorito, não o id do item) |
| GET / POST | `/api/favorite-collections/` | Lista favoritos de coleções do usuário logado / favorita uma coleção (`{ "collection_id": <id> }`) |
| DELETE | `/api/favorite-collections/<id>/` | Remove um favorito de coleção (usa o id do **registro** de favorito) |

---

## Rotas do frontend

| Rota | Tela |
|---|---|
| `/` | Login |
| `/cadastro` | Cadastro de usuário |
| `/home` | Home (itens e coleções populares, busca) |
| `/item/:id` | Página de um item |
| `/colecao/:id` | Página de uma coleção |
| `/perfil/:id` | Perfil do usuário logado |
| `/perfil-usuario/:id` | Perfil público de outro usuário |
| `/editar-perfil` | Editar perfil |
| `/editar-item/:id` | Editar item |
| `/editar-colecao/:id` | Editar coleção |
| `/excluir-conta` | Excluir conta |
| `/adicionar-item` | Adicionar item |
| `/adicionar-colecao` | Adicionar coleção |
| `/busca` | Busca de itens/coleções |
| `/configuracoes` | Configurações |

---

## Padrão de Projeto (Design Patterns)

Facade (Padrão Estrutural)
Arquivo: src/components/AdicionarColecao/colecaoFacade.js
Onde é aplicado: Na tela de Adicionar Coleção (adicionarcolecao.jsx).

Como funciona no projeto:
O padrão Facade foi implementado para atuar como uma interface unificada e simplificada entre o componente visual do React e as regras de negócio complexas da aplicação. Em vez de a página de adicionar coleção gerenciar diretamente a validação local, a formatação dos dados (payload) e a requisição HTTP, ela apenas chama a função salvarColecao exposta pela fachada.

Vantagens obtidas:

Baixo Acoplamento: O componente de interface (front-end) não tem conhecimento de como os dados são salvos ou processados internamente.

Manutenibilidade: Se a API, os endpoints ou as regras de validação mudarem no futuro, as alterações serão feitas exclusivamente no arquivo do Facade, mantendo o componente visual 100% intacto e sem impactos na interface do usuário.

---

## Observações

- Imagens enviadas (avatares, imagens de itens) ficam salvas em `backend/media/` e servidas pelo Django em desenvolvimento (`MEDIA_URL`/`MEDIA_ROOT` em `config/settings.py`).
- O banco usado em desenvolvimento é SQLite (`db.sqlite3`), sem necessidade de configuração extra.
