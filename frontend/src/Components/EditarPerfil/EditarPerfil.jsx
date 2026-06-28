import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditarPerfil.css";

const mockUser = {
  name: "AmoHelloKitty123",
  email: "AmoHelloKitty123@gmail.com",
  avatar: "https://placehold.co/80x80/fce4ec/c2185b?text=A",
};

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // estado do avatar: guarda o File real (pra enviar) e a preview (pra exibir)
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(mockUser.avatar);
  const [avatarSaved, setAvatarSaved] = useState(false); //feedback de "salvo!"
  const [avatarError, setAvatarError] = useState(""); // erro de tipo/tamanho

  const [nameSaved, setNameSaved] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // bloco inteiro da função.
  // ANTES: manipulava o DOM direto com document.querySelector(".edit-profile-avatar").src = url
  // AGORA: usa estado React (avatarFile + avatarPreview), sem tocar no DOM manualmente
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarError("");

    //validação básica de tipo (o accept="image/*" do input é só sugestão visual,
    // então confirmamos aqui também)
    if (!file.type.startsWith("image/")) {
      setAvatarError("Selecione um arquivo de imagem válido.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  //salva o avatar (monta o FormData com o File real)
  const handleSaveAvatar = () => {
    if (!avatarFile) return; // nada novo pra salvar

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    // TODO: descomentar quando o back estiver pronto:
    // fetch('url-da-api/usuario/avatar', {
    //   method: 'PUT',
    //   headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    //   body: formData, // não definir Content-Type manualmente
    // })
    //   .then(res => {
    //     if (res.ok) {
    //       setAvatarSaved(true);
    //       setTimeout(() => setAvatarSaved(false), 2000);
    //     }
    //   })

    // Por enquanto, só simula o feedback de sucesso
    setAvatarSaved(true);
    setTimeout(() => setAvatarSaved(false), 2000);
  };

  const handleSaveName = () => {
    setNameError("");
    if (name.trim() === "") {
      setNameError("O nome não pode ser vazio.");
      return;
    }
    // TODO: fetch('url-da-api/usuario/nome', { method: 'PUT', body: JSON.stringify({ name }) })
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleSaveEmail = () => {
    setEmailError("");
    if (!validateEmail(email)) {
      setEmailError("Digite um email válido.");
      return;
    }
    // TODO: fetch('url-da-api/usuario/email', { method: 'PUT', body: JSON.stringify({ email }) })
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
    // TODO: fetch('url-da-api/usuario/senha', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) })
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <div className="edit-profile-page">

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

        <div className="edit-profile-avatar-section">
          <img
            className="edit-profile-avatar"
            src={avatarPreview}
            alt="Foto de perfil"
          />
          <input
            type="file"
            id="avatar-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange} // 🆕 ALTERADO — antes tinha a função inline com document.querySelector
          />
          <button
            className="edit-profile-avatar-btn"
            onClick={() => document.getElementById("avatar-input").click()}
          >
            Editar foto
          </button>
          {/*erro de tipo de arquivo */}
          {avatarError && <p className="edit-profile-error">{avatarError}</p>}
          {/*botão salvar só aparece se o usuário trocou a foto */}
          {avatarFile && (
            <button
              className="edit-profile-save-btn"
              onClick={handleSaveAvatar}
              style={{ marginTop: "8px" }}
            >
              {avatarSaved ? "salvo!" : "salvar foto"}
            </button>
          )}
        </div>

        <div className="edit-profile-field">
          <label className="edit-profile-label">Nome</label>
          <input
            className={`edit-profile-input ${nameError ? "input-error" : ""}`}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim() !== "") setNameError("");
            }}
          />
          {nameError && <p className="edit-profile-error">{nameError}</p>}
          <button className="edit-profile-save-btn" onClick={handleSaveName}>
            {nameSaved ? "salvo!" : "salvar"}
          </button>
        </div>

        <div className="edit-profile-field">
          <label className="edit-profile-label">Email</label>
          <input
            className={`edit-profile-input ${emailError ? "input-error" : ""}`}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />
          {emailError && <p className="edit-profile-error">{emailError}</p>}
          <button className="edit-profile-save-btn" onClick={handleSaveEmail}>
            {emailSaved ? "salvo!" : "salvar"}
          </button>
        </div>

        <div className="edit-profile-password-section">
          <h2 className="edit-profile-password-title">Mudar Senha</h2>

          <div className="edit-profile-field">
            <label className="edit-profile-label">Senha Atual</label>
            <input
              className={`edit-profile-input ${currentPasswordError ? "input-error" : ""}`}
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setCurrentPasswordError("");
              }}
            />
            {currentPasswordError && <p className="edit-profile-error">{currentPasswordError}</p>}
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label">Nova Senha</label>
            <input
              className={`edit-profile-input ${newPasswordError ? "input-error" : ""}`}
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setNewPasswordError("");
              }}
            />
            {newPasswordError && <p className="edit-profile-error">{newPasswordError}</p>}
          </div>

          <div className="edit-profile-password-footer">
            <button className="edit-profile-change-btn" onClick={handleChangePassword}>
              {passwordSaved ? "alterado!" : "mudar"}
            </button>
          </div>
        </div>

        {/* Botão excluir conta — redireciona para tela de confirmação */}
        <div className="edit-profile-delete-row">
          <button
            className="edit-profile-delete-btn"
            onClick={() => navigate("/excluir-conta")}
          >
            excluir conta
          </button>
        </div>

      </main>
    </div>
  );
}
