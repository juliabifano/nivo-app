export function isSchedulePayment(transaction, paymentId) {
  return !transaction.isPreview && (transaction.schedulePaymentId === paymentId || transaction.invoicePaymentId === paymentId);
}

export function createSchedulePaymentTransaction(item) {
  const date = new Date(item.data);
  const data = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const isInvoice = item.origem === "fatura";

  return {
    descricao: item.descricao,
    valor: item.valor,
    tipo: item.tipo,
    data,
    categoriaId: item.categoriaId || null,
    formaPagamento: isInvoice ? "pagamento_fatura" : item.formaPagamento || "pix",
    accountId: item.accountId || null,
    cartaoId: isInvoice ? null : item.cartaoId || null,
    schedulePaymentId: item.paymentId,
    invoicePaymentId: isInvoice ? item.paymentId : null,
    cardInvoiceId: isInvoice ? item.sourceId : null,
    origem: isInvoice ? "pagamento_fatura" : "orcamento",
  };
}

export function createSchedulePaymentController() {
  const pending = new Set();

  return {
    isPending: (paymentId) => pending.has(paymentId),
    async toggle({ item, transactions, add, update, removePayment }) {
      if (pending.has(item.paymentId)) return;
      pending.add(item.paymentId);
      try {
        if (item.status === "pago") {
          await removePayment(item.paymentId);
        } else if (!transactions.some((transaction) => isSchedulePayment(transaction, item.paymentId))) {
          const preview = transactions.find((transaction) => transaction.isPreview && transaction.schedulePaymentId === item.paymentId);
          const payload = createSchedulePaymentTransaction(item);
          const saved = preview
            ? await update(preview.id, { ...payload, isPreview: false })
            : await add(payload);
          if (!saved) throw new Error("Não foi possível registrar o pagamento.");
        }
      } finally {
        pending.delete(item.paymentId);
      }
    },
  };
}
