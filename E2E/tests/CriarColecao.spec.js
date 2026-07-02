import { test, expect } from "@playwright/test";
import { gerarUsuarioUnico } from "../utils/api.js";

test.describe("Operação: Cadastro de usuário e criação de coleção", () => {
  test("usuário se cadastra e cria uma coleção", async ({ page }) => {
    const usuario = gerarUsuarioUnico("e2e_cadastro");
    const nomeColecao = `Coleção Teste ${Date.now()}`;

    await page.goto("/cadastro");
    await page.locator("#username").fill(usuario.username);
    await page.locator("#email").fill(usuario.email);
    await page.locator("#password").fill(usuario.password);
    await page.locator("#confirmPassword").fill(usuario.password);

    const profileLoaded = page.waitForResponse(
      (resp) => resp.url().includes("/api/profile/") && resp.ok()
    );

    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page).toHaveURL(/\/home$/, { timeout: 10_000 });

    await profileLoaded;

    await page.locator(".navbar-avatar").click();
    await expect(page).toHaveURL(/\/perfil\/\d+$/);

    await page.getByRole("button", { name: "Coleções" }).click();
    await page.getByText("Suas coleções").waitFor();
    await page.getByText("Adicionar Coleção").click();

    await expect(page).toHaveURL(/\/adicionar-colecao$/);

    await page.getByPlaceholder("Nome da coleção").fill(nomeColecao);
    await page.getByRole("button", { name: "salvar" }).click();

    await expect(page.getByText("Coleção criada com sucesso!")).toBeVisible();
    await expect(page).toHaveURL(/\/perfil\/\d+$/, { timeout: 5_000 });

    await page.getByRole("button", { name: "Coleções" }).click();
    await expect(page.getByText(nomeColecao)).toBeVisible();
  });
});