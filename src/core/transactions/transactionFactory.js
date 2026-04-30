export function createTransaction(raw) {
  return {
    id: crypto.randomUUID(),

    descricao: raw.descricao?.trim() || "",
    valor: Number(raw.valor) || 0,

    tipo: raw.tipo || "despesa",

    categoriaId: raw.categoriaId ?? null,

    data: raw.data || new Date().toISOString().split("T")[0],

    formaPagamento: raw.formaPagamento || "pix",
    cartaoId: raw.cartaoId ?? null,
    parcelas: Number(raw.parcelas || 1),

    contaId: raw.contaId ?? null,
    accountId: raw.accountId ?? null,

    createdAt: new Date().toISOString(),
  };
}