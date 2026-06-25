// ============================================================
// FACADE — AdicionarColecaoFacade
// Centraliza toda a lógica de criação de coleção:
// validação dos campos, montagem do objeto e chamada à API.
// O componente React (AdicionarColecao.jsx) só chama este arquivo
// sem precisar conhecer os detalhes de cada operação.
// ============================================================

// ── Subsistema 1: Validação ──────────────────────────────────
// Responsável por verificar se os campos obrigatórios estão corretos
function validarCampos({ name }) {
  const errors = {};

  if (!name || name.trim() === "") {
    errors.name = "O nome da coleção é obrigatório.";
  }

  // TODO: adicionar outras validações quando o back exigir
  // ex: tamanho máximo do nome, caracteres inválidos, etc.

  return errors; // objeto vazio = sem erros
}

// ── Subsistema 2: Montagem do objeto ────────────────────────
// Monta o payload que será enviado para a API
function montarPayload({ name, description, items }) {
  return {
    name: name.trim(),
    description: description.trim(),
    // TODO: quando o back estiver pronto, items serão os IDs dos itens
    // já cadastrados ou os dados completos dependendo do contrato da API
    items: items.map((item) => item.id),
  };
}

// ── Subsistema 3: Chamada à API ──────────────────────────────
// TODO: substituir pela chamada real quando o back estiver pronto:
// fetch('url-da-api/colecoes/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('access')}`,
//   },
//   body: JSON.stringify(payload),
// })
//   .then(res => res.json())
//   .then(data => data) // retorna a coleção criada com o id gerado
function chamarAPI(payload) {
  // Simulação do retorno da API enquanto o back não está pronto
  return Promise.resolve({
    id: Date.now(),
    ...payload,
  });
}

// ── Facade principal ─────────────────────────────────────────
// Interface única que o componente React usa.
// Retorna { success, errors, colecao }
export async function salvarColecao({ name, description, items }) {
  // 1. Valida os campos
  const errors = validarCampos({ name });
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // 2. Monta o payload
  const payload = montarPayload({ name, description, items });

  // 3. Chama a API
  const colecao = await chamarAPI(payload);

  // 4. Retorna sucesso com a coleção criada
  return { success: true, errors: {}, colecao };
}
