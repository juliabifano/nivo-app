export function createAccount(raw) {
  if (!raw?.nome) {
    throw new Error("Conta precisa ter nome");
  }

  return {
    id: crypto.randomUUID(),

    nome: raw.nome.trim(),
    banco: raw.banco || "",
    tipo: raw.tipo || "corrente", // corrente | poupanca | carteira

    saldoInicial: Number(raw.saldoInicial || 0),

    createdAt: new Date().toISOString(),
  };
}