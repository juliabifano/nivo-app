import { motion } from "framer-motion";
import { getBank } from "../data/banks";

export default function CardItem({
  cartao,
  onSelect,
  onEdit,
  onDelete,
  formatCurrency,
  getCardSummary,
}) {
  const bank = getBank(cartao.banco);
  const summary = getCardSummary(cartao);

  const formatCardNumber = (num) => {
    if (!num) return "•••• •••• •••• 0000";
    const digits = num.replace(/\D/g, "");
    return `•••• •••• •••• ${digits.slice(-4)}`;
  };

  const isCredito = cartao.tipo === "credito" || cartao.tipo === "multiplo";
  const isDebito = cartao.tipo === "debito";
  const isVale = cartao.tipo === "vale";

  const percent = summary.percent || 0;

  const getBarColor = () => {
    if (percent > 80) return "bg-red-400";
    if (percent > 50) return "bg-yellow-400";
    return "bg-emerald-400";
  };

  return (
    <motion.div
      onClick={onSelect}
      className="relative w-[380px] h-[220px] rounded-2xl p-5 cursor-pointer overflow-hidden group"
      style={{
        backgroundImage: `url(/cards/${bank.key}.svg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: `0 10px 40px ${bank.cor}40`,
      }}
      whileHover={{ scale: 1.04, rotateX: 4, rotateY: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* logo */}
      <img
        src={bank.logo}
        className="absolute top-4 right-4 w-10 h-10 object-contain z-10"
      />

      {/* botões */}
      <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          className="text-xs bg-white/20 px-2 py-1 rounded"
        >
          Editar
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-xs bg-red-500/70 px-2 py-1 rounded"
        >
          Excluir
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="relative z-10 text-white flex flex-col gap-[2px]">
        <p className="text-xs opacity-70 uppercase">{bank.nome}</p>

        <p className="text-xs opacity-60">
          {isCredito && "Crédito"}
          {isDebito && "Débito"}
          {isVale && "Vale"}
        </p>

        <p className="font-semibold text-lg">{cartao.nome}</p>

        <p className="text-xs opacity-60 font-mono">
          {formatCardNumber(cartao.numeroCartao)}
        </p>

        {/* ================= CRÉDITO ================= */}
        {isCredito && (
          <div className="mt-3 flex flex-col gap-[2px]">
            <p className="text-sm">Fatura: {formatCurrency(summary.fatura)}</p>

            <p className="text-sm">Limite: {formatCurrency(summary.limite)}</p>

            <p className="text-xs opacity-70">
              Disponível: {formatCurrency(summary.disponivel)}
            </p>

            {/* 🔥 LINHA DE CONSUMO (voltou aqui) */}
            <div className="w-full h-1.5 bg-white/20 rounded-full mt-2">
              <div
                className={`h-1.5 ${getBarColor()}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        {/* ================= DÉBITO ================= */}
        {isDebito && (
          <div className="mt-3">
            <p className="text-sm text-blue-300">Saldo da conta</p>
            <p className="text-lg font-semibold">
              {formatCurrency(summary.saldo)}
            </p>
          </div>
        )}

        {/* ================= VALE ================= */}
        {isVale && (
          <div className="mt-3 flex flex-col gap-[2px]">
            <p>Saldo inicial: {formatCurrency(summary.saldoInicial)}</p>

            <p className="text-red-300">
              Gasto: {formatCurrency(summary.gasto)}
            </p>

            <p className="font-semibold">
              Disponível: {formatCurrency(summary.disponivel)}
            </p>

            <div className="w-full h-1.5 bg-white/20 rounded-full mt-2">
              <div
                className="h-1.5 bg-emerald-400"
                style={{
                  width: `${summary.percentVale || 0}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
