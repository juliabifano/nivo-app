import { motion } from "framer-motion";
import { getBank } from "../../data/banks";

export default function CardItem({
  c,
  transactions,
  setSelected,
  setEditandoCartao,
  setConfirmDelete,
  getGasto,
  getLastResetDate,
  formatCurrency,
  formatCardNumber,
}) {
  const banco = getBank(c.banco);

  const cor = banco.cor;
  const logo = banco.logo;
  const nomeBanco = banco.nome;

  const imagem = `/cards/${banco.key}.svg`;

  const gasto = getGasto(c.id);

  let limite = Number(c.limite || 0);
  let saldo = Number(c.saldo || 0);

  let disponivel = 0;
  let percent = 0;

  if (c.tipo === "credito" || c.tipo === "multiplo") {
    disponivel = limite - gasto;
    percent = limite > 0 ? (gasto / limite) * 100 : 0;
  }

  if (c.tipo === "vale") {
    const lastReset = getLastResetDate(c.diaReset);

    const gastoPeriodo = (Array.isArray(transactions) ? transactions : [])
      .filter((t) => {
        if (t.cartaoId !== c.id) return false;

        const data = new Date(t.data);
        return lastReset ? data >= lastReset : true;
      })
      .reduce((acc, t) => acc + Number(t.valor), 0);

    disponivel = saldo - gastoPeriodo;
    percent = saldo > 0 ? (gastoPeriodo / saldo) * 100 : 0;
  }

  percent = Math.min(percent, 100);

  const getBarColor = () => {
    if (percent > 80) return "bg-red-400";
    if (percent > 50) return "bg-yellow-400";
    return "bg-emerald-400";
  };

  return (
    <motion.div
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
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* GLASS */}
      <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none z-0" />

      {/* SHINE */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/2 top-0 w-[50%] h-full bg-white/10 skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
      </div>

      {/* GLOW */}
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
        <p className="text-xs opacity-70 uppercase">{nomeBanco || c.banco}</p>

        <p className="text-xs opacity-60 mt-1">
          {c.tipo === "credito" && "Crédito"}
          {c.tipo === "debito" && "Débito"}
          {c.tipo === "multiplo" && "Crédito + Débito"}
          {c.tipo === "vale" && "Vale"}
        </p>

        <p className="font-semibold text-lg mt-1">{c.nome}</p>

        <p className="text-xs mt-2 opacity-60 font-mono tracking-widest">
          {formatCardNumber(c.numeroCartao)}
        </p>

        <div className="mt-6">
          {(c.tipo === "credito" || c.tipo === "multiplo") && (
            <>
              <p className="text-sm">Limite: {formatCurrency(limite)}</p>

              <p className="text-xs opacity-70">
                Disponível: {formatCurrency(disponivel)}
              </p>
            </>
          )}

          {c.tipo === "vale" && (
            <>
              <p className="text-sm">Saldo: {formatCurrency(saldo)}</p>
              <p className="text-xs opacity-70">
                Restante: {formatCurrency(disponivel)}
              </p>
            </>
          )}

          {((["credito", "multiplo"].includes(c.tipo) && limite > 0) ||
            (c.tipo === "vale" && saldo > 0)) && (
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
}
