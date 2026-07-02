import { test, expect } from "@playwright/test";
import { prepararUsuarioComColecao } from "../utils/api.js";

test.describe("Operação: Criar item e editá-lo, conferindo onde ele deveria aparecer", () => {
    test("usuário cria um item na coleção, confere no perfil, edita o nome e confere a atualização", async ({
    page,
    request,
    }) => {
    const { tokens, perfil, colecao } = await prepararUsuarioComColecao(
        request,
        "e2e_editar_item"
    );

    const nomeItem = `Item Teste ${Date.now()}`;
    const nomeItemEditado = `${nomeItem} (editado)`;

    await page.addInitScript(
        ({ access, refresh, userId }) => {
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("user_id", String(userId));
        },
        { access: tokens.access, refresh: tokens.refresh, userId: perfil.id }
    );

    const profileLoaded = page.waitForResponse(
        (resp) => resp.url().includes("/api/profile/") && resp.ok()
    );

    await page.goto("/home");
    await profileLoaded;

    await page.locator(".navbar-avatar").click();
    await expect(page).toHaveURL(/\/perfil\/\d+$/);

    await page.getByText("Seus itens").waitFor();
    await page.getByText("Adicionar Item").click();

    await expect(page).toHaveURL(/\/adicionar-item$/);

    await page.getByPlaceholder("Nome do item").fill(nomeItem);
    await page.locator(".add-item-select").selectOption({ label: colecao.name });
    await page.getByRole("button", { name: "salvar" }).click();

    await expect(page).toHaveURL(/\/perfil\/\d+$/, { timeout: 5_000 });

    const itemCard = page.locator(".profile-item-card", { hasText: nomeItem });
    await expect(itemCard).toBeVisible({ timeout: 10_000 });

    await itemCard.getByRole("button", { name: "Editar item" }).click();

    await expect(page).toHaveURL(/\/editar-item\/\d+$/);

    const nomeInput = page.locator(".edit-item-input");
    await nomeInput.fill("");
    await nomeInput.fill(nomeItemEditado);

    await page.getByRole("button", { name: "Salvar alterações" }).click();
    await expect(page.getByRole("button", { name: "Salvo!" })).toBeVisible({
        timeout: 5_000,
    });

    await page.locator(".edit-item-back-btn").click();
    await expect(page).toHaveURL(/\/perfil\/\d+$/);

    await expect(
        page.locator(".profile-item-card", { hasText: nomeItemEditado })
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText(nomeItem, { exact: true })).not.toBeVisible();
    });
});