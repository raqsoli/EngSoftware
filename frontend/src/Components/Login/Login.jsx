import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, salvarTokens, salvarUserId } from "../../api";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUsernameError("");
    setPasswordError("");
    setServerError("");

    let hasError = false;

    if (username.trim() === "") {
      setUsernameError("Digite seu nome de usuário.");
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await apiFetch("/api/token/", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setServerError("Usuário ou senha incorretos.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      salvarTokens(data);

      // Busca o perfil do usuário recém-logado para salvar o ID dele
      // Isso é necessário para saber, em outras telas, se o dono de um
      // item/coleção é o próprio usuário logado ou outra pessoa
      const profileRes = await apiFetch("/api/profile/");
      if (profileRes.ok) {
        const profile = await profileRes.json();
        salvarUserId(profile.id);
      }

      setLoading(false);
      navigate("/home");
    } catch (err) {
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
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
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
  );
};

export default Login;
