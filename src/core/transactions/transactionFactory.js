export function createTransaction(raw) {
  return {
    id: raw.id || crypto.randomUUID(),

    descricao: raw.descricao?.trim() || "",
    valor: Number(raw.valor) || 0,

    tipo: raw.tipo || "despesa",

    categoriaId: raw.categoriaId || null,

    data: raw.data || new Date().toISOString().split("T")[0],

    formaPagamento: raw.formaPagamento || "pix",
    cartaoId: raw.cartaoId || null,
    parcelas: Number(raw.parcelas || 1),

    contaId: raw.contaId || null,
    accountId: raw.accountId || null,

    invoicePaymentId: raw.invoicePaymentId ?? null,
    cardInvoiceId: raw.cardInvoiceId ?? null,
    schedulePaymentId: raw.schedulePaymentId ?? null,
    origem: raw.origem ?? null,
    isPreview: raw.isPreview ?? false,

    createdAt: raw.createdAt || new Date().toISOString(),
  };
}
