import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // estados para armazenar as mensagens de erro de cada campo
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  // valida o formato do email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // reseta os erros antes de validar
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!validateEmail(username)) {
      setEmailError("Digite um email válido.");
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }

    // se houver erro, interrompe e não navega
    if (hasError) return;

    // TODO: quando o back estiver pronto, substituir por chamada à API
    navigate('/home');
  }

  return (
    <div className="login-page">
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <h1>Acesse o Sistema</h1>

          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder='exemplo@mail.com'
              required
              className={emailError ? "input-error" : ""}
              onChange={(e) => {
                setUsername(e.target.value);
                setEmailError(""); // limpa o erro enquanto o usuário digita
              }}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>

          <div className="input-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              className={passwordError ? "input-error" : ""}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(""); // limpa o erro enquanto o usuário digita
              }}
            />
            {passwordError && <span className="error-message">{passwordError}</span>}
          </div>

          <button type="submit">Entrar</button>

        </form>
      </div>
    </div>
  )
}

export default Login
