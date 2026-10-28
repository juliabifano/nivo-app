import test from "node:test";
import assert from "node:assert/strict";
import { createSchedulePaymentController, createSchedulePaymentTransaction, isSchedulePayment } from "./schedulePayment.js";
import { getPaymentSchedule } from "../selectors/paymentScheduleSelectors.js";
import { getAccountBalance } from "../selectors/accountSelectors.js";

const budget = {
  id: "budget-1", descricao: "Internet", valorMensal: 99.90, tipo: "despesa",
  meses: ["out", "nov"], diaVencimento: 10, accountId: "account-1", formaPagamento: "pix",
};
const paymentId = "orcamento-budget-1-out-2026";
const getItem = (transactions = [], extra = {}) => getPaymentSchedule({
  items: [budget], transactions, month: "out", year: 2026, ...extra,
})[0];

test("marcar e desmarcar repetidamente não acumula histórico nem altera o saldo após desfazer", async () => {
  const controller = createSchedulePaymentController();
  let transactions = [];
  let nextId = 0;
  const add = async (raw) => {
    const saved = { ...raw, id: String(++nextId) };
    transactions.push(saved);
    return saved;
  };
  const removePayment = async (id) => {
    transactions = transactions.filter((transaction) => !isSchedulePayment(transaction, id));
  };
  const account = { id: "account-1", saldoInicial: 500 };

  for (let i = 0; i < 5; i++) {
    await controller.toggle({ item: getItem(transactions), transactions, add, removePayment });
    assert.equal(transactions.length, 1);
    assert.equal(getItem(transactions).status, "pago");
    assert.equal(getAccountBalance(account, transactions), 400.10);
    await controller.toggle({ item: getItem(transactions), transactions, add, removePayment });
    assert.equal(transactions.length, 0);
    assert.notEqual(getItem(transactions).status, "pago");
    assert.equal(getAccountBalance(account, transactions), 500);
  }
});

test("cliques concorrentes no mesmo pagamento só fazem uma inclusão", async () => {
  const controller = createSchedulePaymentController();
  let release;
  let calls = 0;
  const add = () => {
    calls++;
    return new Promise((resolve) => { release = resolve; });
  };
  const args = { item: getItem(), transactions: [], add };
  const first = controller.toggle(args);
  assert.equal(controller.isPending(paymentId), true);
  await controller.toggle(args);
  assert.equal(calls, 1);
  release({ id: "saved" });
  await first;
  assert.equal(controller.isPending(paymentId), false);
});

test("lançamento já salvo impede inclusão mesmo quando a interface ainda mostra pendente", async () => {
  const controller = createSchedulePaymentController();
  let calls = 0;
  await controller.toggle({
    item: getItem(), transactions: [{ schedulePaymentId: paymentId }],
    add: async () => { calls++; },
  });
  assert.equal(calls, 0);
});

test("desfazer remove todas as duplicatas vinculadas e preserva outros lançamentos", async () => {
  const controller = createSchedulePaymentController();
  const manual = { id: "manual", descricao: "Internet", valor: 99.90 };
  const otherMonth = { id: "nov", schedulePaymentId: "orcamento-budget-1-nov-2026" };
  const otherBudget = { id: "other", schedulePaymentId: "orcamento-budget-2-out-2026" };
  let transactions = [manual, otherMonth, otherBudget,
    { id: "dup-1", schedulePaymentId: paymentId },
    { id: "dup-2", schedulePaymentId: paymentId },
  ];
  await controller.toggle({
    item: getItem(transactions), transactions,
    removePayment: async (id) => {
      transactions = transactions.filter((transaction) => !isSchedulePayment(transaction, id));
    },
  });
  assert.deepEqual(transactions, [manual, otherMonth, otherBudget]);
});

test("falhas na inclusão ou exclusão não confirmam pagamento e liberam nova tentativa", async () => {
  const controller = createSchedulePaymentController();
  await assert.rejects(controller.toggle({ item: getItem(), transactions: [], add: async () => null }));
  assert.equal(controller.isPending(paymentId), false);
  const transactions = [{ schedulePaymentId: paymentId }];
  await assert.rejects(controller.toggle({
    item: getItem(transactions), transactions,
    removePayment: async () => { throw new Error("Sem permissão para excluir"); },
  }));
  assert.equal(getItem(transactions).status, "pago");
  assert.equal(controller.isPending(paymentId), false);
});

test("status depende das transações, não de uma marcação antiga do navegador", () => {
  assert.notEqual(getItem([], { paidIds: [paymentId] }).status, "pago");
  assert.equal(getItem([{ schedulePaymentId: paymentId }]).status, "pago");
});

test("payload preserva conta, categoria, método e dia local do vencimento", () => {
  const item = getItem([], { items: [{ ...budget, categoriaId: "category-1", formaPagamento: "debito" }] });
  const transaction = createSchedulePaymentTransaction(item);
  assert.equal(transaction.accountId, "account-1");
  assert.equal(transaction.categoriaId, "category-1");
  assert.equal(transaction.formaPagamento, "debito");
  assert.equal(transaction.data, "2026-10-10");
  assert.equal(transaction.valor, 99.90);
});

test("fatura reconhece pagamentos pela Agenda antiga e pelo fluxo de cartões", () => {
  const card = { id: "card-1", nome: "Cartão", tipo: "credito", fechamento: 20, vencimento: 25 };
  const purchase = { id: "purchase", cartaoId: card.id, formaPagamento: "credito", data: "2026-10-01", valor: 50 };
  const invoiceId = "invoice-card-1-10-2026";
  for (const payment of [{ schedulePaymentId: invoiceId }, { invoicePaymentId: invoiceId }]) {
    const [item] = getPaymentSchedule({ cards: [card], transactions: [purchase, payment], month: "out", year: 2026 });
    assert.equal(item.status, "pago");
    const payload = createSchedulePaymentTransaction(item);
    assert.equal(payload.invoicePaymentId, invoiceId);
    assert.equal(payload.formaPagamento, "pagamento_fatura");
    assert.equal(payload.cardInvoiceId, card.id);
    assert.equal(payload.cartaoId, null);
  }
});
