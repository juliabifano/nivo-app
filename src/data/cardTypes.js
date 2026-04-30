export const CARD_TYPES = {
  credito: {
    temFatura: true,
    mostraResumo: true,
    mostraLimite: true,
    usaFaturaNoResumo: true,

    // 🆕 comportamento financeiro (novo padrão)
    calculaFatura: true,
    calculaSaldo: false,
  },

  multiplo: {
    temFatura: true,
    mostraResumo: true,
    mostraLimite: true,
    usaFaturaNoResumo: true,

    calculaFatura: true,
    calculaSaldo: false,
  },

  debito: {
    temFatura: false,
    mostraResumo: false,
    mostraLimite: false,
    usaFaturaNoResumo: false,

    calculaFatura: false,
    calculaSaldo: true,
  },

  vale: {
    temFatura: false,
    mostraResumo: true,
    mostraLimite: false,
    usaFaturaNoResumo: false,

    calculaFatura: false,
    calculaSaldo: true,
  },
};

export function getCardConfig(tipo) {
  return CARD_TYPES[tipo] ?? CARD_TYPES.credito;
}
