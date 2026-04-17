import { useState } from "react";
import { useBudget } from "../contexts/BudgetContext";
import { motion, AnimatePresence } from "framer-motion";
import RightSidebarCards from "../components/RightSidebarCards";

export default function Cards() {
  const { cartoes = [], setCartoes, transactions = [] } = useBudget();

  const [selected, setSelected] = useState(null);
  const [editandoCartao, setEditandoCartao] = useState(null);

  // 📌 bancos
  const logosBanco = {
    nubank: "/banks/nubank.svg",
    inter: "/banks/inter.svg",
    itau: "/banks/itau.svg",
    santander: "/banks/santander.svg",
    bradesco: "/banks/bradesco.svg",
    bb: "/banks/bb.svg",
    caixa: "/banks/caixa.svg",
    sicoob: "/banks/sicoob.svg",
    c6: "/banks/c6.svg",
    original: "/banks/original.svg",
    alelo: "/banks/alelo.svg",
    default: "/banks/default.svg",
  };

  const coresBanco = {
    nubank: "#8A05BE",
    inter: "#FF7A00",
    itau: "#EC7000",
    santander: "#E30613",
    bradesco: "#CC092F",
    bb: "#F2C811",
    caixa: "#0047AB",
    sicoob: "#00A859",
    c6: "#000000",
    original: "#1F2937",
    alelo: "#10B981",
    default: "#111827",
  };

  const nomesBanco = {
    nubank: "Nubank",
    inter: "Inter",
    itau: "Itaú",
    santander: "Santander",
    bradesco: "Bradesco",
    bb: "Banco do Brasil",
    caixa: "Caixa",
    sicoob: "Sicoob",
    c6: "C6 Bank",
    original: "Banco Original",
    alelo: "Alelo",
  };

  const normalizeBankName = (name = "") => {
    const n = name.toLowerCase().trim();

    if (n.includes("nubank")) return "nubank";
    if (n.includes("inter")) return "inter";
    if (n.includes("itaú") || n.includes("itau")) return "itau";
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

  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const getTransacoes = (id) => transactions.filter((t) => t.cartao === id);

  const getGasto = (id) =>
    getTransacoes(id).reduce((acc, t) => acc + Number(t.valor), 0);

  const formatCardNumber = (num) => {
    if (!num) return "•••• •••• •••• 0000";
    const digits = num.replace(/\D/g, "");
    return `•••• •••• •••• ${digits.slice(-4)}`;
  };

  const handleDelete = (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este cartão?",
    );
    if (!confirmar) return;

    setCartoes(cartoes.filter((c) => c.id !== id));

    if (selected?.id === id) {
      setSelected(null);
    }
  };

  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div className="flex h-screen ">
      {/* GRID */}
      <div className="flex-1 p-6 overflow-y-auto pr-[360px] relative z-0">
        {" "}
        <h1 className="text-2xl font-semibold mb-6">Cartões</h1>
        <div className="flex flex-wrap gap-6">
          {cartoes.map((c) => {
            const key = normalizeBankName(c.banco);

            const cor = coresBanco[key];
            const logo = logosBanco[key];
            const imagem = `/cards/${key}.svg`;

            const gasto = getGasto(c.id);
            const limite = c.limite || 0;
            const disponivel = limite - gasto;

            const percent = limite > 0 ? (gasto / limite) * 100 : 0;

            const getBarColor = () => {
              if (percent > 80) return "bg-red-400";
              if (percent > 50) return "bg-yellow-400";
              return "bg-emerald-400";
            };

            return (
              <motion.div
                key={c.id}
                onClick={() => setSelected(c)}
                className="relative w-[380px] h-[220px] rounded-2xl p-5 cursor-pointer overflow-hidden group"
                style={{
                  backgroundImage: `url(${imagem})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: `0 10px 40px ${cor}40`,
                }}
                whileHover={{
                  scale: 1.04,
                  rotateX: 4,
                  rotateY: -4,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {/* 🔥 OVERLAY ESCURO */}
                <div className="absolute inset-0 bg-black/30 z-0" />

                {/* 🔥 GLASS */}
                <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none z-0" />

                {/* ✨ SHINE ANIMADO */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -left-1/2 top-0 w-[50%] h-full bg-white/10 skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
                </div>

                {/* 💡 GLOW */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                  style={{
                    boxShadow: `0 0 40px ${cor}80`,
                  }}
                />

                {/* LOGO */}
                <img
                  src={logo}
                  className="absolute top-4 right-4 w-10 h-10 object-contain z-10"
                />

                {/* BOTÕES */}
                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditandoCartao(c);
                    }}
                    className="text-xs bg-white/20 px-2 py-1 rounded cursor-pointer backdrop-blur"
                  >
                    Editar
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(c);
                    }}
                    className="text-xs bg-red-500/70 px-2 py-1 rounded cursor-pointer backdrop-blur"
                  >
                    Excluir
                  </button>
                </div>

                {/* CONTEÚDO */}
                <div className="text-white relative z-10">
                  <p className="text-xs opacity-70 uppercase">
                    {nomesBanco[key] || c.banco}
                  </p>

                  <p className="text-xs opacity-60 mt-1">
                    {c.tipo === "credito" && "Crédito"}
                    {c.tipo === "debito" && "Débito"}
                    {c.tipo === "multiplo" && "Crédito + Débito"}
                  </p>

                  <p className="font-semibold text-lg mt-1">{c.nome}</p>

                  <p className="text-xs mt-2 opacity-60 font-mono tracking-widest">
                    {formatCardNumber(c.numeroCartao)}
                  </p>

                  <div className="mt-6">
                    <p className="text-sm">Limite: {formatCurrency(limite)}</p>

                    <p className="text-xs opacity-70">
                      Disponível: {formatCurrency(disponivel)}
                    </p>

                    {limite > 0 && (
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-1.5 rounded-full ${getBarColor()}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SIDEBAR */}
      <RightSidebarCards
        editandoCartao={editandoCartao}
        setEditandoCartao={setEditandoCartao}
      />

      {/* VIEW EXPANDIDA (APP STORE) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="w-[600px] max-h-[80vh] rounded-2xl p-6 overflow-y-auto"
              style={{
                background: `linear-gradient(135deg, ${
                  coresBanco[normalizeBankName(selected.banco)] || "#111827"
                }, #0b0f1a)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* TÍTULO */}
              <h2 className="text-white text-xl font-semibold">
                {selected.nome}
              </h2>

              {/* RESUMO DO CARTÃO */}
              {(() => {
                const gastoSelecionado = getGasto(selected.id);
                const limiteSelecionado = Number(selected.limite || 0);
                const disponivelSelecionado =
                  limiteSelecionado - gastoSelecionado;

                return (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <p className="text-xs text-gray-300">Limite</p>
                      <p className="text-white font-semibold">
                        {formatCurrency(limiteSelecionado)}
                      </p>
                    </div>

                    <div className="bg-white/10 p-3 rounded-lg">
                      <p className="text-xs text-gray-300">Utilizado</p>
                      <p className="text-red-400 font-semibold">
                        {formatCurrency(gastoSelecionado)}
                      </p>
                    </div>

                    <div className="bg-white/10 p-3 rounded-lg">
                      <p className="text-xs text-gray-300">Disponível</p>
                      <p className="text-emerald-400 font-semibold">
                        {formatCurrency(disponivelSelecionado)}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* TRANSAÇÕES */}
              <div className="mt-5 flex flex-col gap-3">
                {getTransacoes(selected.id).map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between bg-white/10 p-3 rounded-lg"
                  >
                    <span className="text-white text-sm">
                      {t.descricao.toUpperCase()}
                    </span>
                    <span className="text-white/70 text-sm">
                      {formatCurrency(t.valor)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50  bg-opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              className="bg-[#111827]/70 p-6 rounded-2xl w-[460px] backdrop-opacity-60"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white text-lg font-semibold mb-2">
                Excluir cartão
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Tem certeza que deseja excluir{" "}
                <span className="text-white font-medium">
                  {confirmDelete.nome}
                </span>
                ?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded bg-white/10 text-white cursor-pointer hover:scale-105"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    setCartoes(
                      cartoes.filter((c) => c.id !== confirmDelete.id),
                    );
                    setConfirmDelete(null);
                  }}
                  className="px-4 py-2 rounded bg-red-500 text-white cursor-pointer  hover:scale-105"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
