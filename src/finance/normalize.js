export function normalizeTransaction(t) {
  return {
    id: t.id,
    descricao: t.descricao || t.name || "",
    valor: Number(t.valor || 0),
    data: t.data || new Date().toISOString(),

    categoria: t.categoria || t.category || t.tipoCategoria || "Sem categoria",

    tipo: t.tipo || t.type || "despesa",

    cartao: t.cartao || null,
    tipoPagamento: t.tipoPagamento || t.formaPagamento || "",
  };
}

export function normalizeCard(c = {}) {
  return {
    id: c.id,
    nome: c.nome || "",
    banco: c.banco, // sempre key (nubank, inter...)
    tipo: c.tipo || "credito",
    limite: Number(c.limite || 0),
    saldoInicial: Number(c.saldoInicial || 0),
  };
}

export function normalizeItem(i = {}) {
  return {
    id: i.id,
    descricao: i.descricao || "",
    valorMensal: Number(i.valorMensal || 0),
    tipo: i.tipo || "despesa",
    categoria: i.categoria || "Sem categoria",
    meses: Array.isArray(i.meses) ? i.meses : [],
  };
}