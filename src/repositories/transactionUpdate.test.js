import test from "node:test";
import assert from "node:assert/strict";
import { updateTransactionRecord, getTransactionSaveError } from "./transactionUpdate.js";
import { createSchedulePaymentController } from "../core/transactions/schedulePayment.js";

function mockClient(responses) {
  const calls = [];
  return {
    calls,
    from(table) {
      const call = { table, filters: [] };
      const query = {
        update(payload) { call.payload = payload; return query; },
        select(columns) { call.columns = columns; return query; },
        eq(column, value) { call.filters.push([column, value]); return query; },
        async maybeSingle() { calls.push(call); return responses.shift(); },
      };
      return query;
    },
  };
}

const transaction = { id: "transaction-1", valor: 103, tipo: "despesa", isPreview: false };

test("confirma o registro salvo e restringe a atualizacao ao id e usuario", async () => {
  const row = { id: transaction.id, valor: 103, is_preview: false };
  const client = mockClient([{ data: row, error: null }]);
  assert.equal(await updateTransactionRecord(client, transaction.id, transaction, "user-1"), row);
  assert.equal(client.calls.length, 1);
  assert.deepEqual(client.calls[0].filters, [["id", "transaction-1"], ["user_id", "user-1"]]);
  assert.equal(client.calls[0].payload.is_preview, false);
  assert.equal(client.calls[0].payload.valor, 103);
  assert.equal("user_id" in client.calls[0].payload, false);
});

test("UPDATE sem linhas com SELECT permitido indica que a atualizacao nao foi confirmada", async () => {
  const client = mockClient([{ data: null, error: null }, { data: { id: transaction.id }, error: null }]);
  await assert.rejects(updateTransactionRecord(client, transaction.id, transaction, "user-1"),
    (error) => error.code === "TRANSACTION_UPDATE_NOT_CONFIRMED");
  assert.equal(client.calls[1].columns, "id");
  assert.deepEqual(client.calls[1].filters, client.calls[0].filters);
});

test("distingue registro removido ou inacessivel de atualizacao bloqueada", async () => {
  const client = mockClient([{ data: null, error: null }, { data: null, error: null }]);
  await assert.rejects(updateTransactionRecord(client, transaction.id, transaction, "user-1"),
    (error) => error.code === "TRANSACTION_NOT_FOUND");
});

test("falhas do banco e da consulta de confirmacao continuam sendo erros", async () => {
  const failure = { code: "42501", message: "permission denied" };
  for (const responses of [
    [{ data: null, error: failure }],
    [{ data: null, error: null }, { data: null, error: failure }],
  ]) {
    await assert.rejects(updateTransactionRecord(mockClient(responses), transaction.id, transaction, "user-1"),
      (error) => error === failure);
  }
});

test("Agenda preserva a previsao ao falhar e permite realizar apos liberar o UPDATE", async () => {
  const paymentId = "orcamento-budget-1-out-2026";
  let saved = { ...transaction, schedulePaymentId: paymentId, isPreview: true };
  const client = mockClient([
    { data: null, error: null }, { data: { id: saved.id }, error: null },
    { data: { id: saved.id, valor: 103, is_preview: false }, error: null },
  ]);
  const controller = createSchedulePaymentController();
  const args = {
    item: { paymentId, valor: 103, data: new Date(2026, 9, 12), origem: "orcamento", status: "pendente" },
    transactions: [saved],
    add: () => assert.fail("nao deve criar outra transacao"),
    update: async (id, changes) => {
      const row = await updateTransactionRecord(client, id, { ...saved, ...changes }, "user-1");
      saved = { ...saved, valor: row.valor, isPreview: row.is_preview };
      return saved;
    },
  };
  await assert.rejects(controller.toggle(args), { code: "TRANSACTION_UPDATE_NOT_CONFIRMED" });
  assert.equal(saved.isPreview, true);
  assert.equal(controller.isPending(paymentId), false);
  await controller.toggle(args);
  assert.equal(saved.isPreview, false);
  assert.equal(saved.valor, 103);
});

test("mensagem da tela explica casos conhecidos sem expor erros internos", () => {
  assert.equal(getTransactionSaveError({ code: "TRANSACTION_UPDATE_NOT_CONFIRMED", message: "Verifique a permissao." }, "Tente novamente."), "Verifique a permissao.");
  assert.equal(getTransactionSaveError({ code: "42501", message: "internal details" }, "Tente novamente."), "Tente novamente.");
});
