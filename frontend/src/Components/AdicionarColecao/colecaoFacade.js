import { apiFetch } from "../../api"; // ajuste o caminho conforme a pasta real do seu arquivo

// ── Subsistema 1: Validação 
// Responsável por verificar se os campos obrigatórios estão corretos
function validarCampos({ name }) {
  const errors = {};

  if (!name || name.trim() === "") {
    errors.name = "O nome da coleção é obrigatório.";
  }

  return errors; // objeto vazio = sem erros
}

// ── Subsistema 2: Montagem do payload 
// Monta o objeto que será enviado para a API
function montarPayload({ name, description }) {
  return {
    name: name.trim(),
    description: description.trim(),
  };
}

// ── Subsistema 3: Chamada à API 
// bloco inteiro: antes retornava um objeto simulado
// com Promise.resolve(). Agora chama POST /api/collections/ de verdade.
// Continua isolado numa função própria, então se a forma de chamar a
// API mudar no futuro (ex: outro endpoint, outro método), só essa
// função precisa ser tocada — o resto do Facade nem percebe a mudança.
async function chamarAPI(payload) {
  const response = await apiFetch("/api/collections/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    // Lança um erro estruturado, que o Facade principal vai capturar
    // e traduzir para o formato { success, errors } que o componente espera
    const error = new Error("Falha ao criar coleção");
    error.apiErrors = data;
    throw error;
  }

  return response.json(); // retorna a coleção criada com o id gerado pelo back
}

// ── Facade principal 
// Interface única que o componente React usa.
// Retorna { success, errors, colecao }
export async function salvarColecao({ name, description }) {
  // 1. Valida os campos (camada local, rápida, antes de gastar uma requisição)
  const errors = validarCampos({ name });
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // 2. Monta o payload
  const payload = montarPayload({ name, description });

  // 3. Chama a API —  agora dentro de try/catch, já que é uma chamada real
  // que pode falhar por erro de validação do back ou problema de rede
  try {
    const colecao = await chamarAPI(payload);
    // 4. Retorna sucesso com a coleção criada
    return { success: true, errors: {}, colecao };
  } catch (err) {
    // traduz o erro da API para o mesmo formato { success, errors }
    // que o componente já sabia interpretar antes (nada muda na ponta do .jsx)
    if (err.apiErrors?.name) {
      const nameMsg = Array.isArray(err.apiErrors.name) ? err.apiErrors.name[0] : err.apiErrors.name;
      return { success: false, errors: { name: nameMsg } };
    }
    return { success: false, errors: { server: "Não foi possível criar a coleção." } };
  }
}
