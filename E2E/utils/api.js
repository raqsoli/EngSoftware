const API_BASE_URL = "http://127.0.0.1:8000";

export function gerarUsuarioUnico(prefixo = "e2e") {
  const sufixo = Date.now().toString(36) + Math.floor(Math.random() * 1000);
  return {
    username: `${prefixo}_${sufixo}`,
    email: `${prefixo}_${sufixo}@teste.com`,
    password: "Senha123",
  };
}

export async function registrarUsuario(request, usuario) {
  const res = await request.post(`${API_BASE_URL}/api/register/`, {
    data: usuario,
  });

  if (!res.ok()) {
    throw new Error(
      `Falha ao registrar usuário de teste: ${res.status()} ${await res.text()}`
    );
  }

  return res.json();
}

export async function obterTokens(request, usuario) {
  const res = await request.post(`${API_BASE_URL}/api/token/`, {
    data: { username: usuario.username, password: usuario.password },
  });

  if (!res.ok()) {
    throw new Error(`Falha ao logar usuário de teste: ${res.status()}`);
  }

  return res.json();
}

export async function criarColecao(request, accessToken, dados) {
  const res = await request.post(`${API_BASE_URL}/api/collections/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: {
      name: dados.name,
      description: dados.description ?? "",
    },
  });

  if (!res.ok()) {
    throw new Error(`Falha ao criar coleção de teste: ${res.status()}`);
  }

  return res.json();
}


export async function prepararUsuarioComColecao(request, prefixo) {
  const usuario = gerarUsuarioUnico(prefixo);
  await registrarUsuario(request, usuario);
  const tokens = await obterTokens(request, usuario);

  const colecao = await criarColecao(request, tokens.access, {
    name: `Coleção E2E ${Date.now()}`,
  });

  return { usuario, tokens, colecao };
}