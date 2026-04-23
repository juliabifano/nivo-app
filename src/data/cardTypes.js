export const CARD_TYPES = {
  credito: {
    label: "Crédito",
    hasLimit: true,
    hasDueDate: true,
    hasAccount: false,
    hasBalance: false,
    hasFatura: true,
  },

  debito: {
    label: "Débito",
    hasLimit: false,
    hasDueDate: false,
    hasAccount: true,
    hasBalance: true,
    hasFatura: false,
  },

  multiplo: {
    label: "Múltiplo",
    hasLimit: true,
    hasDueDate: true,
    hasAccount: true,
    hasBalance: false,
    hasFatura: true,
  },

  vale: {
    label: "Vale",
    hasLimit: false,
    hasDueDate: false,
    hasAccount: false,
    hasBalance: true,
    hasFatura: false,
  },
};

export const getCardType = (type) =>
  CARD_TYPES[type] || CARD_TYPES.credito;