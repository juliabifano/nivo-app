import test from "node:test";
import assert from "node:assert/strict";
import { getScheduleSummary } from "./scheduleSummary.js";

test("separa receitas e despesas previstas, realizadas e pendentes", () => {
  assert.deepEqual(getScheduleSummary([
    { tipo: "receita", valor: 3000, status: "pago" },
    { tipo: "receita", valor: 500, status: "pendente" },
    { tipo: "despesa", valor: 100, status: "pago" },
    { tipo: "despesa", valor: 200, status: "atrasado" },
    { tipo: "despesa", valor: 50, status: "hoje", origem: "fatura" },
  ]), {
    previsto: { receita: 3500, despesa: 350 },
    realizado: { receita: 3000, despesa: 100 },
    pendente: { receita: 500, despesa: 250 },
  });
});

test("resume uma agenda vazia com valores zerados", () => {
  assert.deepEqual(getScheduleSummary(), {
    previsto: { receita: 0, despesa: 0 },
    realizado: { receita: 0, despesa: 0 },
    pendente: { receita: 0, despesa: 0 },
  });
});

test("soma centavos sem acumular imprecisão decimal", () => {
  const summary = getScheduleSummary([
    { tipo: "receita", valor: 0.1, status: "pago" },
    { tipo: "receita", valor: 0.2, status: "pago" },
    { tipo: "despesa", valor: "19.90", status: "pendente" },
  ]);
  assert.equal(summary.previsto.receita, 0.3);
  assert.equal(summary.realizado.receita, 0.3);
  assert.equal(summary.pendente.despesa, 19.9);
});
