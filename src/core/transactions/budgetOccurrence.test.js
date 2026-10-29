import test from "node:test";
import assert from "node:assert/strict";
import { saveTransactionEdit } from "./budgetOccurrence.js";
import { createBudgetItem } from "../budget/budgetFactory.js";
import { createTransaction } from "./transactionFactory.js";
import { getPaymentSchedule } from "../selectors/paymentScheduleSelectors.js";
import { getAccountBalance } from "../selectors/accountSelectors.js";
import { createSchedulePaymentController } from "./schedulePayment.js";
import { getDashboardSnapshot } from "../selectors/dashboardSelectors.js";
import { generateInvoice } from "../../utils/invoices.js";
import { getFutureBalance } from "../../utils/getFutureBalance.js";

const budget = {
  id: "budget-1", descricao: "Internet", valorMensal: 100, tipo: "despesa",
  meses: ["out", "nov"], diaVencimento: 10, accountId: "account-1", formaPagamento: "pix",
};
const paymentId = "orcamento-budget-1-out-2026";
const preview = {
  id: "budget-budget-1-out-2026", schedulePaymentId: paymentId,
  origem: "orcamento", isPreview: true,
};
const changes = {
  descricao: "Internet", valor: 125.5, tipo: "despesa", data: "2026-10-10",
  accountId: "account-1", formaPagamento: "pix",
};

test("editar previsão salva somente a ocorrência mensal e mantém pendente após recarregar", async () => {
  let saved;
  await saveTransactionEdit({ transaction: preview, changes, transactions: [],
    add: async (raw) => { saved = createTransaction(raw); return saved; },
    update: () => assert.fail("não deve atualizar um id virtual"),
  });
  assert.notEqual(saved.id, preview.id);
  assert.equal(saved.schedulePaymentId, paymentId);
  assert.equal(saved.isPreview, true);
  const reloaded = JSON.parse(JSON.stringify(saved));
  const getSchedule = (month) => getPaymentSchedule({ items: [budget], transactions: [reloaded], month, year: 2026, initialBalance: 500 });
  assert.equal(getSchedule("out")[0].valor, 125.5);
  assert.notEqual(getSchedule("out")[0].status, "pago");
  assert.equal(getSchedule("out")[0].saldoPrevisto, 374.5);
  assert.equal(getSchedule("nov")[0].valor, 100);
  assert.equal(budget.valorMensal, 100);
  assert.equal(getAccountBalance({ id: "account-1", saldoInicial: 500 }, [reloaded]), 500);
});

test("editar novamente usa a ocorrência existente, inclusive com a tela desatualizada", async () => {
  const existing = { ...preview, id: "saved-id", ...changes };
  let updatedId;
  await saveTransactionEdit({ transaction: preview, changes: { valor: 80 }, transactions: [existing],
    add: () => assert.fail("não deve duplicar"),
    update: async (id, data) => { updatedId = id; assert.equal(data.valor, 80); },
  });
  assert.equal(updatedId, "saved-id");
});

test("erros de persistência são propagados sem tratar a edição como salva", async () => {
  await assert.rejects(saveTransactionEdit({ transaction: preview, changes, transactions: [], add: async () => null }));
  await assert.rejects(saveTransactionEdit({ transaction: { id: "saved-id" }, changes, transactions: [],
    update: async () => { throw new Error("falha no banco"); },
  }), /falha no banco/);
});

test("realizar ocorrência editada atualiza a previsão em vez de criar outra transação", async () => {
  let transactions = [{ ...changes, ...preview, id: "saved-id" }];
  const item = getPaymentSchedule({ items: [budget], transactions, month: "out", year: 2026 })[0];
  await createSchedulePaymentController().toggle({ item, transactions,
    add: () => assert.fail("não deve duplicar"),
    update: async (id, data) => {
      assert.equal(id, "saved-id");
      transactions = [{ ...transactions[0], ...data }];
      return transactions[0];
    },
  });
  assert.equal(transactions.length, 1);
  assert.equal(transactions[0].valor, 125.5);
  assert.equal(transactions[0].isPreview, false);
  assert.equal(getPaymentSchedule({ items: [budget], transactions, month: "out", year: 2026 })[0].status, "pago");
  assert.equal(getAccountBalance({ id: "account-1", saldoInicial: 500 }, transactions), 374.5);
});

test("campos opcionais vazios são enviados como null e valores como números", () => {
  const raw = { descricao: " Internet ", valorMensal: "99.90", valor: "99.90", diaVencimento: "10", categoriaId: "", cartaoId: "", accountId: "" };
  const item = createBudgetItem(raw);
  assert.equal(item.valorMensal, 99.9);
  assert.equal(item.diaVencimento, 10);
  for (const normalized of [item, createTransaction(raw)]) {
    assert.equal(normalized.categoriaId, null);
    assert.equal(normalized.cartaoId, null);
    assert.equal(normalized.accountId, null);
  }
});

test("resumo e previsão não duplicam o orçamento com valor mensal ajustado", () => {
  const today = new Date();
  const month = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][today.getMonth()];
  const item = { ...budget, meses: [month] };
  const transaction = { ...changes, id: "saved-id", isPreview: true,
    data: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-10`,
    schedulePaymentId: `orcamento-${item.id}-${month}-${today.getFullYear()}`,
  };
  const snapshot = getDashboardSnapshot({ budgetItems: [item], transactions: [transaction] });
  assert.equal(snapshot.summary.despesas, 125.5);
  assert.equal(snapshot.chartData.find((point) => point.mes === month).despesa, 125.5);
  const timeline = getFutureBalance({ budgetItems: [item], transactions: [transaction], initialBalance: 500 });
  assert.equal(timeline[8].saldo, 500);
  assert.equal(timeline[9].saldo, 374.5);
  assert.equal(timeline.at(-1).saldo, 374.5);
});

test("fatura usa a ocorrência ajustada uma única vez", () => {
  const card = { id: "card-1", fechamento: 20 };
  const transaction = { ...changes, ...preview, id: "saved-id", formaPagamento: "credito", cartaoId: card.id };
  const invoice = generateInvoice({ transactions: [transaction], budgetItems: [{ ...budget, formaPagamento: "credito", cartaoId: card.id }], card, month: 10, year: 2026 });
  assert.equal(invoice.total, 125.5);
  assert.equal(invoice.transactions.length, 1);
});
