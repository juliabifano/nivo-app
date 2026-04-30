export function createCategory(raw) {
  return {
    id: crypto.randomUUID(),

    nome: raw.nome?.trim() || "Sem nome",

    createdAt: new Date().toISOString(),
  };
}