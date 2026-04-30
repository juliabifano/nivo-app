export function createCardModel({
  nome,
  tipo, // credito | debito | vale | multiplo
}) {
  return {
    id: crypto.randomUUID(),
    nome,
    tipo,
    createdAt: new Date().toISOString(),
  };
}