export function createCard(raw) {
  if (!raw?.nome) {
    throw new Error("Cartão precisa ter nome");
  }

  if (!raw?.tipo) {
    throw new Error("Cartão precisa ter tipo");
  }

  return {
    id: crypto.randomUUID(),

    nome: raw.nome.trim(),
    banco: raw.banco || "",
    numeroCartao: raw.numeroCartao || "",

    tipo: raw.tipo,

    limite: ["credito", "multiplo"].includes(raw.tipo)
      ? Number(raw.limite || 0)
      : undefined,

    saldo: raw.tipo === "vale" ? Number(raw.saldo || 0) : undefined,

    vencimento: ["credito", "multiplo"].includes(raw.tipo)
      ? Number(raw.vencimento || 0)
      : undefined,

    fechamento: ["credito", "multiplo"].includes(raw.tipo)
      ? Number(raw.fechamento || 0)
      : undefined,

    diaReset: raw.tipo === "vale" ? Number(raw.diaReset || 1) : undefined,
    accountId: raw.accountId ?? null,

    createdAt: new Date().toISOString(),
  };
}
