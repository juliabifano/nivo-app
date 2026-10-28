import test from "node:test";
import assert from "node:assert/strict";
import { getOnboardingState, persistOnboardingStatus } from "./onboarding.js";

const empty = { loading: false, accounts: [], categories: [], cards: [], transactions: [], items: [] };
const configured = { ...empty, accounts: [{}], categories: [{}], cards: [{}], transactions: [{}] };

test("conta nova recebe boas-vindas somente depois de carregar", () => {
  assert.equal(getOnboardingState(empty).needsWelcome, true);
  const pending = getOnboardingState({ ...empty, loading: true });
  assert.equal(pending.needsWelcome, false);
  assert.equal(pending.active, false);
});

test("dados carregados em outro navegador reconhecem a configuração completa", () => {
  const state = getOnboardingState(configured);
  assert.equal(state.finished, true);
  assert.equal(state.active, false);
  assert.equal(state.needsWelcome, false);
});

test("cadastros parciais retomam as etapas reais, independentemente da rota", () => {
  const state = getOnboardingState({ ...empty, cards: [{}] });
  assert.equal(state.active, true);
  assert.equal(state.needsWelcome, false);
  assert.equal(state.steps["/accounts"], false);
  assert.equal(state.steps["/cards"], true);
  assert.equal(state.allStepsCompleted, false);
});

test("início salvo mantém o fluxo ativo antes do primeiro cadastro", () => {
  const state = getOnboardingState({ ...empty, status: "active" });
  assert.equal(state.active, true);
  assert.equal(state.needsWelcome, false);
});

test("conclusão e pulo salvos não reiniciam após excluir cadastros", () => {
  for (const status of ["completed", "skipped"]) {
    const state = getOnboardingState({ ...empty, status });
    assert.equal(state.finished, true);
    assert.equal(state.active, false);
    assert.equal(state.needsWelcome, false);
  }
});

test("estado de outra conta não dispensa as boas-vindas de uma conta vazia", () => {
  getOnboardingState({ ...configured, status: "completed" });
  assert.equal(getOnboardingState(empty).needsWelcome, true);
});

test("conclusão por dados só acontece depois de terminar o carregamento", () => {
  const state = getOnboardingState({ ...configured, loading: true });
  assert.equal(state.finished, false);
  assert.equal(state.active, false);
});

test("progresso é salvo nos metadados da conta pelo Supabase", async () => {
  const calls = [];
  const auth = { updateUser: async (payload) => { calls.push(payload); return { error: null }; } };
  for (const status of ["active", "completed", "skipped"]) {
    await persistOnboardingStatus(auth, status);
    assert.deepEqual(calls.at(-1), { data: { nivo_onboarding_status: status } });
  }
});

test("falha ao salvar é propagada para permitir aviso e nova tentativa", async () => {
  const error = new Error("Offline");
  await assert.rejects(persistOnboardingStatus({ updateUser: async () => ({ error }) }, "skipped"), error);
});
