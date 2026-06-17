import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CadastroUsuario.css";

export default function Cadastro() {
  const navigate = useNavigate();

  // Estados dos campos
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados de erro — mesmo padrão do Login.jsx
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Erro retornado pelo back — ex: email já cadastrado
  // TODO: quando o back estiver pronto, preencher esse estado com o erro da API
  const [serverError, setServerError] = useState("");

  // Mesma função de validação do Login.jsx
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reseta todos os erros antes de validar
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setServerError("");

    let hasError = false;

    // Valida nome de usuário — não pode ser vazio
    if (username.trim() === "") {
      setUsernameError("Digite um nome de usuário.");
      hasError = true;
    }

    // Valida formato do email — mesmo padrão do Login.jsx
    if (!validateEmail(email)) {
      setEmailError("Digite um email válido.");
      hasError = true;
    }

    // Valida senha — mínimo 6 caracteres e pelo menos 1 letra maiúscula
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("A senha deve conter pelo menos 1 letra maiúscula.");
      hasError = true;
    }

    // Valida confirmação de senha
    if (confirmPassword !== password) {
      setConfirmPasswordError("As senhas não coincidem.");
      hasError = true;
    }

    // Se houver erro, interrompe e não envia
    if (hasError) return;

    // TODO: quando o back estiver pronto, substituir por chamada à API:
    // fetch('url-da-api/cadastro', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, email, password })
    // })
    // .then(res => {
    //   if (res.status === 409) {
    //     setServerError("Este email já está cadastrado.");
    //     return;
    //   }
    //   navigate('/home');
    // })

    // Por enquanto, navega direto para a homepage
    navigate("/home");
  };

  // Ícone de olho aberto (senha visível)
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  // Ícone de olho fechado (senha oculta)
  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <div className="cadastro-page">
      <div className="cadastro-container">
        <h1 className="cadastro-title">Cadastrar-se</h1>

        <form onSubmit={handleSubmit}>

          {/* Campo Nome de Usuário */}
          <div className="cadastro-field">
            <label className="cadastro-label" htmlFor="username">
              Nome de Usuário
            </label>
            <input
              id="username"
              className={`cadastro-input ${usernameError ? "input-error" : ""}`}
              type="text"
              placeholder=""
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError("");
              }}
            />
            {usernameError && <p className="cadastro-error">{usernameError}</p>}
          </div>

          {/* Campo Email */}
          <div className="cadastro-field">
            <label className="cadastro-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={`cadastro-input ${emailError ? "input-error" : ""}`}
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            {emailError && <p className="cadastro-error">{emailError}</p>}
          </div>

          {/* Campo Senha */}
          <div className="cadastro-field">
            <label className="cadastro-label" htmlFor="password">
              Senha
            </label>
            <div className="cadastro-input-wrapper">
              <input
                id="password"
                className={`cadastro-input ${passwordError ? "input-error" : ""}`}
                type={showPassword ? "text" : "password"}
                placeholder=""
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
              />
              <button
                type="button"
                className="cadastro-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {passwordError && <p className="cadastro-error">{passwordError}</p>}
          </div>

          {/* Campo Confirmar Senha */}
          <div className="cadastro-field">
            <label className="cadastro-label" htmlFor="confirmPassword">
              Confirme sua Senha
            </label>
            <div className="cadastro-input-wrapper">
              <input
                id="confirmPassword"
                className={`cadastro-input ${confirmPasswordError ? "input-error" : ""}`}
                type={showConfirmPassword ? "text" : "password"}
                placeholder=""
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
              />
              <button
                type="button"
                className="cadastro-eye-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {confirmPasswordError && <p className="cadastro-error">{confirmPasswordError}</p>}
          </div>

          {/* Erro do servidor — ex: email já cadastrado */}
          {/* TODO: esse erro virá do back quando a API retornar erro 409 */}
          {serverError && <p className="cadastro-server-error">{serverError}</p>}

          <button type="submit" className="cadastro-btn">
            Criar conta
          </button>

        </form>

        {/* Link de volta pro login */}
        <div className="cadastro-login-link">
          <span>Já tem uma conta? </span>
          <button
            className="cadastro-login-btn"
            onClick={() => navigate('/')}
            type="button"
          >
            Entrar
          </button>
        </div>

      </div>
    </div>
  );
}
