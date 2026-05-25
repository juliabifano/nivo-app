import { motion } from "framer-motion";
import { getBank } from "../../data/banks";
import ActionMenu from "../ui/ActionMenu";

export default function CardItem({
  c,
  transactions = [],
  setSelected,
  setEditandoCartao,
  setConfirmDelete,
  formatCurrency,
  formatCardNumber,
  index,
  activeIndex,
  positionOffset = 0,
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
      onClick={() => {
        if (window.innerWidth < 1024 && positionOffset !== 0) return;
        setSelected(c);
      }}
      className="
        relative
        snap-center
        shrink-0
        mx-auto
        mb-6
        w-[78vw]
        max-w-[320px]
        h-[210px]
        lg:mx-0
        lg:mb-0
        lg:w-[380px]
        lg:min-w-[380px]
        lg:max-w-none
        lg:h-[220px]
        rounded-2xl
        p-5
        cursor-pointer
        overflow-visible
        group
      "
      style={{
        backgroundImage: `url(${imagem})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: `0 10px 40px ${cor}40`,
        transformStyle: "preserve-3d",
      }}
      animate={
        window.innerWidth < 1024
          ? {
              scale:
                positionOffset === 0
                  ? 1
                  : positionOffset === 1 || positionOffset === -1
                    ? 0.88
                    : 0.78,
              opacity:
                positionOffset === 0
                  ? 1
                  : positionOffset === 1 || positionOffset === -1
                    ? 0.28
                    : 0,
              y: positionOffset * 170,
              rotateX: positionOffset > 0 ? -28 : positionOffset < 0 ? 28 : 0,
              rotateZ: positionOffset > 0 ? -2 : positionOffset < 0 ? 2 : 0,
              zIndex: 20 - Math.abs(positionOffset),
            }
          : {
              scale: 1,
              opacity: 1,
              rotateY: 0,
              rotateZ: 0,
              y: 0,
            }
      }
      whileTap={{ scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 20,
        mass: 0.9,
      }}
    >
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div
        className="absolute top-4 right-4 z-40 flex items-start gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={logo} className="w-10 h-10 object-contain" />

        <ActionMenu
          actions={[
            {
              label: "Editar",
              onClick: () => setEditandoCartao(c),
            },
            {
              label: "Excluir",
              danger: true,
              onClick: () => setConfirmDelete(c),
            },
          ]}
        />
      </div>

      <motion.div
        animate={{
          filter:
            window.innerWidth >= 1024
              ? "blur(0px)"
              : positionOffset === 0
                ? "blur(0px) brightness(1)"
                : "blur(2px) brightness(0.75)",
        }}
        transition={{ duration: 0.2 }}
        className="text-white relative z-10"
      >
        <p className="text-xs opacity-70 uppercase">{nomeBanco || c.banco}</p>

        <p className="text-xs opacity-60 mt-1">{getTipoLabel()}</p>

        <p className="font-semibold text-lg mt-1">{c.nome}</p>

        <p className="text-xs mt-1 opacity-60 font-mono tracking-widest">
          {formatCardNumber(c.numeroCartao)}
        </p>

        <div className="mt-1">
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
      </motion.div>
    </motion.div>
  );
}
