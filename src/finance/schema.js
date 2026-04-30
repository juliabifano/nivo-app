export const SCHEMA = {
  transaction: {
    id: "string",
    descricao: "string",
    valor: "number",
    tipo: "receita | despesa",
    data: "ISO string",
    categoria: "string",
    cartaoId: "string | null",
    tipoPagamento: "string",
  },

  card: {
    id: "string",
    nome: "string",
    banco: "string (key: nubank, inter...)",
    tipo: "credito | debito | multiplo | vale",
    limite: "number",
    saldoInicial: "number",
  },

  item: {
    id: "string",
    descricao: "string",
    valorMensal: "number",
    tipo: "receita | despesa",
    categoria: "string",
    meses: "array<string>",
  },
};