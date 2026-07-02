import { test, expect } from "@playwright/test";
import { prepararUsuarioComColecao } from "../utils/api.js";

test.describe("Operação: Favoritar coleção e conferir na aba Favoritos do perfil", () => {
    test("usuário favorita uma coleção na Home, o coração persiste após reload, e ela aparece em Favoritos", async ({
        page,
        request,
    }) => {
        const { tokens, perfil, colecao } = await prepararUsuarioComColecao(
        request,
        "e2e_fav_col"
    );

    await page.addInitScript(
        ({ access, refresh, userId }) => {
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("user_id", String(userId));
        },
        { access: tokens.access, refresh: tokens.refresh, userId: perfil.id }
    );

    await page.goto("/home");

    const card = page.locator(".collection-card", { hasText: colecao.name });
    await expect(card).toBeVisible({ timeout: 10_000 });

    const heartButton = card.getByRole("button", { name: "Favoritar" });
    await expect(heartButton).toBeVisible();

    await heartButton.click();
    await expect(
        card.getByRole("button", { name: "Desfavoritar" })
    ).toBeVisible();

    await page.reload();
    const cardAposReload = page.locator(".collection-card", {
        hasText: colecao.name,
    });
    await expect(cardAposReload).toBeVisible();
    await expect(
        cardAposReload.getByRole("button", { name: "Desfavoritar" })
    ).toBeVisible({ timeout: 10_000 });

    await page.goto(`/perfil/${perfil.id}`);
    await page.getByRole("button", { name: "Favoritos" }).click();

    await expect(page.getByText("Coleções favoritas")).toBeVisible();

    const favoriteCard = page.locator(".profile-collection-card", {
        hasText: colecao.name,
    });
    await expect(favoriteCard).toBeVisible({ timeout: 10_000 });
    });
});