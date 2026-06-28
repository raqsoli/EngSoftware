import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, salvarTokens } from "../../api"; // ajuste o caminho conforme onde você colocar api.js
import "./Login.css";

const Login = () => {

  // antes "username" guardava um email (o nome da variável já avisava
  // que ia mudar). Mantive o nome da variável pra não quebrar o resto do componente,
  // mas agora ela representa de fato o username que o back espera.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // renomeado de emailError pra usernameError, já que não é mais email
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // erro genérico vindo da API (ex: "usuário ou senha incorretos")
  const [serverError, setServerError] = useState("");

  // true enquanto espera a resposta do back, pra desabilitar o botão
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //REMOVIDO — validateEmail não existe mais, porque o campo não é email.
  // O back já valida o username; o front só confirma que não está vazio.

  const handleSubmit = async (event) => {
    event.preventDefault();

    // reseta os erros antes de validar
    setUsernameError("");
    setPasswordError("");
    setServerError("");

    let hasError = false;

    // antes validava formato de email, agora só checa se não está vazio
    if (username.trim() === "") {
      setUsernameError("Digite seu nome de usuário.");
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }

    if (hasError) return;

    // bloco inteiro: chamada real ao back, antes era só TODO + navigate direto
    setLoading(true);

    try {
      const response = await apiFetch("/api/token/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // trata erro retornado pela API (login/senha incorretos)
        setServerError("Usuário ou senha incorretos.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      // salva access e refresh no localStorage via helper do api.js
      salvarTokens(data);

      setLoading(false);
      navigate("/home");
    } catch (err) {
      //  erro de rede (back fora do ar, sem conexão, etc.)
      setServerError("Não foi possível conectar ao servidor. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <h1>Acesse o Sistema</h1>

          <div className="input-field">
            {/*label e id trocados de "email" para "username" */}
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text" //antes era type="email"
              placeholder='Seu nome de usuário'
              required
              className={usernameError ? "input-error" : ""}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError("");
              }}
            />
            {usernameError && <span className="error-message">{usernameError}</span>}
          </div>

          <div className="input-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              className={passwordError ? "input-error" : ""}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
            {passwordError && <span className="error-message">{passwordError}</span>}
          </div>

          {/* exibe erro vindo do back (usuário/senha incorretos, erro de rede) */}
          {serverError && <span className="error-message">{serverError}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "entrando..." : "Entrar"}
          </button>

        </form>
        <div className="login-cadastro-link">
          <span>Não tem uma conta? </span>
          <button
            className="login-cadastro-btn"
            onClick={() => navigate('/cadastro')}
            type="button"
          >
            Cadastrar-se
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
