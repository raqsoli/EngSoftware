import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, limparTokens } from "../../api";
import "./EditarPerfil.css";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState("");

  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [profileServerError, setProfileServerError] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [passwordServerError, setPasswordServerError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // bloco inteiro: busca os dados reais do perfil ao abrir a tela
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const response = await apiFetch("/api/profile/");

        if (!response.ok) {
          setLoadError("Não foi possível carregar seu perfil.");
          setLoadingProfile(false);
          return;
        }

        const data = await response.json();
        setName(data.username ?? "");
        setEmail(data.email ?? "");
        // A doc diz que imagens retornadas já vêm como URL utilizável direto
        setAvatarPreview(data.image ?? null);
        setLoadingProfile(false);
      } catch (err) {
        setLoadError("Não foi possível conectar ao servidor.");
        setLoadingProfile(false);
      }
    };

    carregarPerfil();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarError("");

    if (!file.type.startsWith("image/")) {
      setAvatarError("Selecione um arquivo de imagem válido.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  //bloco inteiro: antes eram handleSaveName + handleSaveEmail separados.
  // Agora é um único handleSaveProfile que envia nome+email+avatar juntos
  // via PUT /api/profile, usando FormData (porque pode incluir uma imagem)
  const handleSaveProfile = async () => {
    setNameError("");
    setEmailError("");
    setProfileServerError("");

    let hasError = false;

    if (name.trim() === "") {
      setNameError("O nome não pode ser vazio.");
      hasError = true;
    }
    if (!validateEmail(email)) {
      setEmailError("Digite um email válido.");
      hasError = true;
    }
    if (hasError) return;

    setProfileSaving(true);

    const formData = new FormData();
    formData.append("username", name.trim());
    formData.append("email", email.trim());
    // Só envia a imagem se o usuário trocou — assim não sobrescreve
    // a imagem existente com um campo vazio
    if (avatarFile) {
      formData.append("image", avatarFile);
    }

    try {
      const response = await apiFetch("/api/profile/", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // repassa erros de campo retornados pelo back (ex: email já em uso)
        if (data.username) {
          setNameError(Array.isArray(data.username) ? data.username[0] : data.username);
        }
        if (data.email) {
          setEmailError(Array.isArray(data.email) ? data.email[0] : data.email);
        }
        if (!data.username && !data.email) {
          setProfileServerError("Não foi possível salvar o perfil.");
        }
        setProfileSaving(false);
        return;
      }

      // Limpa o avatarFile depois de salvar — a próxima vez que abrir a tela,
      // o avatarPreview já reflete a imagem salva de verdade no back
      setAvatarFile(null);
      setProfileSaving(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setProfileServerError("Não foi possível conectar ao servidor.");
      setProfileSaving(false);
    }
  };

  // 🆕 bloco inteiro: agora chama PUT /api/change-password/ de verdade
  const handleChangePassword = async () => {
    setCurrentPasswordError("");
    setNewPasswordError("");
    setPasswordServerError("");

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

    setPasswordSaving(true);

    try {
      const response = await apiFetch("/api/change-password/", {
        method: "PUT",
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // 🆕 NOVO — trata "senha atual incorreta" vindo do back
        if (data.old_password) {
          setCurrentPasswordError(
            Array.isArray(data.old_password) ? data.old_password[0] : data.old_password
          );
        } else if (data.new_password) {
          setNewPasswordError(
            Array.isArray(data.new_password) ? data.new_password[0] : data.new_password
          );
        } else {
          setPasswordServerError("Não foi possível alterar a senha.");
        }
        setPasswordSaving(false);
        return;
      }

      setPasswordSaving(false);
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordSaved(false), 2000);
    } catch (err) {
      setPasswordServerError("Não foi possível conectar ao servidor.");
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletePasswordError("");

    if (deletePassword.length < 6) {
      setDeletePasswordError("Digite sua senha atual.");
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await apiFetch("/api/delete-account/", {
        method: "DELETE",
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setDeletePasswordError(data.error ?? "Senha incorreta.");
        setDeleteLoading(false);
        return;
      }

      limparTokens();
      navigate("/");
    } catch (err) {
      setDeletePasswordError("Não foi possível conectar ao servidor.");
      setDeleteLoading(false);
    }
  };


  if (loadingProfile) {
    return (
      <div className="edit-profile-page">
        <main className="edit-profile-main">
          <p>Carregando perfil...</p>
        </main>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="edit-profile-page">
        <main className="edit-profile-main">
          <p className="edit-profile-error">{loadError}</p>
        </main>
      </div>
    );
  }

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
            src={avatarPreview || "https://placehold.co/80x80/fce4ec/c2185b?text=?"}
            alt="Foto de perfil"
          />
          <input
            type="file"
            id="avatar-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <button
            className="edit-profile-avatar-btn"
            onClick={() => document.getElementById("avatar-input").click()}
          >
            Editar foto
          </button>
          {avatarError && <p className="edit-profile-error">{avatarError}</p>}
        </div>

        {/* Nome e Email não têm mais botão "salvar" individual */}
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
        </div>

        {/* botão único que salva nome + email + avatar juntos */}
        {profileServerError && <p className="edit-profile-error">{profileServerError}</p>}
        <button
          className="edit-profile-save-btn"
          onClick={handleSaveProfile}
          disabled={profileSaving}
        >
          {profileSaved ? "salvo!" : profileSaving ? "salvando..." : "Salvar perfil"}
        </button>

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

          {passwordServerError && <p className="edit-profile-error">{passwordServerError}</p>}

          <div className="edit-profile-password-footer">
            <button
              className="edit-profile-change-btn"
              onClick={handleChangePassword}
              disabled={passwordSaving}
            >
              {passwordSaved ? "alterado!" : passwordSaving ? "alterando..." : "mudar"}
            </button>
          </div>
        </div>

        <div className="edit-profile-delete-row">
          <button
            className="edit-profile-delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            excluir conta
          </button>
        </div>

      </main>

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <p className="delete-modal-text">
              Para excluir sua conta, confirme sua senha. Essa ação não pode ser desfeita.
            </p>
            <input
              className={`edit-profile-input ${deletePasswordError ? "input-error" : ""}`}
              type="password"
              placeholder="Sua senha atual"
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value);
                setDeletePasswordError("");
              }}
            />
            {deletePasswordError && (
              <p className="edit-profile-error">{deletePasswordError}</p>
            )}
            <div className="delete-modal-actions">
              <button
                className="delete-modal-cancel"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeletePasswordError("");
                }}
                disabled={deleteLoading}
              >
                cancelar
              </button>
              <button
                className="delete-modal-confirm"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? "excluindo..." : "excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}