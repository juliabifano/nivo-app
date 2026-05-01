export function createBudgetItem(raw) {
  return {
    id: crypto.randomUUID(),

    descricao: raw.descricao?.trim() || "",
    valorMensal: Number(raw.valorMensal || 0),

    tipo: raw.tipo || "despesa",
    categoriaId: raw.categoriaId ?? null,

    meses: Array.isArray(raw.meses) ? raw.meses : [],

    diaVencimento: Number(raw.diaVencimento || 1),

    formaPagamento: raw.formaPagamento || "pix",
    accountId: raw.accountId ?? null,
    cartaoId: raw.cartaoId ?? null,

    createdAt: new Date().toISOString(),
  };
}