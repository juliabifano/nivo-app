import { motion } from "framer-motion";
import { getBank } from "../../data/banks";

export default function CardItem({
  c,
  transactions = [],
  setSelected,
  setEditandoCartao,
  setConfirmDelete,
  formatCurrency,
  formatCardNumber,
}) {
  const banco = getBank(c.banco);

  const cor = banco.cor;
  const logo = banco.logo;
  const nomeBanco = banco.nome;
  const bancoKey = c.banco || "default";
  const imagem = `/cards/${bancoKey}.svg`;

  const transacoesDoCartao = transactions.filter(
    (t) => String(t.cartaoId) === String(c.id),
  );

  const gastoReal = transacoesDoCartao
    .filter((t) => !t.isPreview)
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const gastoPrevisto = transacoesDoCartao
    .filter((t) => t.isPreview)
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const gastoTotal = gastoReal + gastoPrevisto;

  const limite = c.limite || 0;
  const saldo = c.saldo || 0;

  const disponivel =
    c.tipo === "vale" ? saldo - gastoTotal : limite - gastoTotal;

  const base = c.tipo === "vale" ? saldo : limite;

  const percent = base > 0 ? Math.min((gastoTotal / base) * 100, 100) : 0;

  const getBarColor = () => {
    if (percent > 80) return "bg-red-400";
    if (percent > 50) return "bg-yellow-400";
    return "bg-emerald-400";
  };

  const getTipoLabel = () => {
    if (c.tipo === "credito") return "Crédito";
    if (c.tipo === "debito") return "Débito";
    if (c.tipo === "multiplo") return "Crédito + Débito";
    if (c.tipo === "vale") return "Vale";
    return "";
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
      whileHover={{ scale: 1.04, rotateX: 4, rotateY: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
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
      <div className="absolute inset-0 bg-black/30" />

      <img
        src={logo}
        className="absolute top-4 right-4 w-10 h-10 object-contain z-10"
      />

      <div className="text-white relative z-10">
        <p className="text-xs opacity-70 uppercase">{nomeBanco || c.banco}</p>

        <p className="text-xs opacity-60 mt-1">{getTipoLabel()}</p>

        <p className="font-semibold text-lg mt-1">{c.nome}</p>

        <p className="text-xs mt-2 opacity-60 font-mono tracking-widest">
          {formatCardNumber(c.numeroCartao)}
        </p>

        <div className="mt-2">
          {(c.tipo === "credito" || c.tipo === "multiplo") && (
            <>
              <p className="text-sm">Limite: {formatCurrency(limite)}</p>
              <p className="text-xs opacity-70">
                Disponível: {formatCurrency(disponivel)}
              </p>

              <p className="text-xs opacity-70">
                Atual: {formatCurrency(gastoReal)}
              </p>

              {gastoPrevisto > 0 && (
                <p className="text-xs text-yellow-200">
                  Previsto: {formatCurrency(gastoPrevisto)}
                </p>
              )}
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

          {(limite > 0 || saldo > 0) && (
            <div className="w-full h-1.5 bg-white/20 rounded-full mt-3">
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
