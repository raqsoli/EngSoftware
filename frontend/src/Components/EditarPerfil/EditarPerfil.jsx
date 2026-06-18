import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditarPerfil.css";

// ============================================================
// DADOS MOCKADOS — substituir quando o back estiver pronto
// TODO: remover mockUser e substituir por chamada à API:
// const [user, setUser] = useState(null)
// useEffect(() => {
//   fetch('url-da-api/usuario/perfil')
//     .then(res => res.json())
//     .then(data => setUser(data))
// }, [])
// O back vai retornar: id, name, email, avatar
// ============================================================
const mockUser = {
  name: "AmoHelloKitty123",
  email: "AmoHelloKitty123@gmail.com",
  avatar: "https://placehold.co/80x80/fce4ec/c2185b?text=A",
};

export default function EditProfilePage() {
  const navigate = useNavigate();

  // Estados dos campos — hoje começam com os dados mockados
  // TODO: quando o back estiver pronto, iniciar com os dados reais do usuário
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Controla mensagens de feedback para o usuário
  const [nameSaved, setNameSaved] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // estados de erro — mesmo padrão do Login.jsx
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  // mesma função de validação do Login.jsx
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveName = () => {
    setNameError("");

    // Valida nome — não pode ser vazio
    if (name.trim() === "") {
      setNameError("O nome não pode ser vazio.");
      return;
    }
    // TODO: quando o back estiver pronto, enviar para a API:
    // fetch('url-da-api/usuario/nome', { method: 'PUT', body: JSON.stringify({ name }) })
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleSaveEmail = () => {
    setEmailError("");
    if (!validateEmail(email)) {
      setEmailError("Digite um email válido.");
      return;
    }
    // TODO: quando o back estiver pronto, enviar para a API:
    // fetch('url-da-api/usuario/email', { method: 'PUT', body: JSON.stringify({ email }) })
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2000);
  };

  const handleChangePassword = () => {
    setCurrentPasswordError("");
    setNewPasswordError("");
    let hasError = false;
    if (currentPassword.length < 6) {
      setCurrentPasswordError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }
    if (newPassword.length < 6) {
      setNewPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    } else if (!/[A-Z]/.test(newPassword)) {
      setNewPasswordError("A nova senha deve conter pelo menos 1 letra maiúscula.");
      hasError = true;
    }

    if (hasError) return;
    // TODO: quando o back estiver pronto, enviar para a API:
    // fetch('url-da-api/usuario/senha', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) })
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <div className="edit-profile-page">

      {/* Cabeçalho */}
      <header className="edit-profile-header">
        <button
          className="edit-profile-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Voltar para perfil"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="edit-profile-title">Perfil</h1>
      </header>

      <main className="edit-profile-main">

        {/* Avatar — funcionalidade de troca de foto será implementada depois */}
        {/* TODO: adicionar troca de foto de perfil futuramente */}
        <div className="edit-profile-avatar-section">
          <img
            className="edit-profile-avatar"
            src={mockUser.avatar}
            alt="Foto de perfil"
          />
          {/* Input oculto que abre o seletor de arquivos */}
          {/* TODO: quando o back estiver pronto, enviar a imagem para a API */}
          <input
            type="file"
            id="avatar-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                // mostra preview da imagem escolhida
                const url = URL.createObjectURL(file);
                document.querySelector(".edit-profile-avatar").src = url;
              }
            }}
          />
          <button
            className="edit-profile-avatar-btn"
            onClick={() => document.getElementById("avatar-input").click()}
          >
            Editar foto
          </button>
        </div>

        {/* Campo Nome */}
        <div className="edit-profile-field">
          <label className="edit-profile-label">Nome</label>
          <input
            className={`edit-profile-input ${nameError ? "input-error" : ""}`}
            type="text"
            value={name}
            // TODO: valor inicial virá do back
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim() !== "") setNameError(""); // ← linha alterada
            }}
          />
          {nameError && <p className="edit-profile-error">{nameError}</p>}
          <button
            className="edit-profile-save-btn"
            onClick={handleSaveName}
          >
            {nameSaved ? "salvo!" : "salvar"}
          </button>
        </div>

        {/* Campo Email */}
        <div className="edit-profile-field">
          <label className="edit-profile-label">Email</label>
          <input
            className={`edit-profile-input ${emailError ? "input-error" : ""}`}
            type="email"
            value={email}
            // TODO: valor inicial virá do back
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="edit-profile-error">{emailError}</p>}
          <button
            className="edit-profile-save-btn"
            onClick={handleSaveEmail}
          >
            {emailSaved ? "salvo!" : "salvar"}
          </button>
        </div>

        {/* Seção Mudar Senha */}
        <div className="edit-profile-password-section">
          <h2 className="edit-profile-password-title">Mudar Senha</h2>

          <div className="edit-profile-field">
            <label className="edit-profile-label">Senha Atual</label>
            <input
              className={`edit-profile-input ${currentPasswordError ? "input-error" : ""}`}
              type="password"
              value={currentPassword}
              // TODO: validar com o back se a senha atual está correta
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {currentPasswordError && <p className="edit-profile-error">{currentPasswordError}</p>}
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label">Nova Senha</label>
            <input
              className={`edit-profile-input ${newPasswordError ? "input-error" : ""}`}
              type="password"
              value={newPassword}
              placeholder=""
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {newPasswordError && <p className="edit-profile-error">{newPasswordError}</p>}
          </div>

          <div className="edit-profile-password-footer">
            <button
              className="edit-profile-change-btn"
              onClick={handleChangePassword}
            >
              {passwordSaved ? "alterado!" : "mudar"}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
