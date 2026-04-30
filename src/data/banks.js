export const BANKS = {
  nubank: {
    nome: "Nubank",
    cor: "#8A05BE",
    logo: "/banks/nubank.svg",
  },
  inter: {
    nome: "Inter",
    cor: "#FF7A00",
    logo: "/banks/inter.svg",
  },
  itau: {
    nome: "Itaú",
    cor: "#EC7000",
    logo: "/banks/itau.svg",
  },
  santander: {
    nome: "Santander",
    cor: "#E30613",
    logo: "/banks/santander.svg",
  },
  bradesco: {
    nome: "Bradesco",
    cor: "#CC092F",
    logo: "/banks/bradesco.svg",
  },
  bb: {
    nome: "Banco do Brasil",
    cor: "#F2C811",
    logo: "/banks/bb.svg",
  },
  caixa: {
    nome: "Caixa",
    cor: "#0047AB",
    logo: "/banks/caixa.svg",
  },
  sicoob: {
    nome: "Sicoob",
    cor: "#00A859",
    logo: "/banks/sicoob.svg",
  },
  c6: {
    nome: "C6 Bank",
    cor: "#000000",
    logo: "/banks/c6.svg",
  },
  original: {
    nome: "Banco Original",
    cor: "#1F2937",
    logo: "/banks/original.svg",
  },
  alelo: {
    nome: "Alelo",
    cor: "#10B981",
    logo: "/banks/alelo.svg",
  },
  default: {
    nome: "Outro",
    cor: "#111827",
    logo: "/banks/default.svg",
  },
};

export const normalizeBankName = (name = "") => {
  const n = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  if (n.includes("nubank")) return "nubank";
  if (n.includes("inter")) return "inter";
  if (n.includes("itau")) return "itau";
  if (n.includes("santander")) return "santander";
  if (n.includes("bradesco")) return "bradesco";
  if (n.includes("banco do brasil") || n === "bb") return "bb";
  if (n.includes("caixa")) return "caixa";
  if (n.includes("sicoob")) return "sicoob";
  if (n.includes("c6")) return "c6";
  if (n.includes("original")) return "original";
  if (n.includes("alelo")) return "alelo";

  return "default";
};

export function getBank(name) {
  const key = normalizeBankName(name);
  return {
    key,
    ...(BANKS[key] || BANKS.default),
  };
}
