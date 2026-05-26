import { getBank } from "../../data/banks";
import Card3D from "../cards/Card3D";
import { motion } from "framer-motion";
import { useTheme } from "../../theme/useTheme";

export default function HeroCardSection({
  featuredCard,
  featuredCardStats,
  transactions,
  formatCurrency,
}) {
  const { theme, themeName } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className={`
      ${theme.surface}
      border ${theme.border}
      rounded-[28px]
      p-3 sm:p-6
      overflow-hidden
      ${
        themeName === "light"
          ? "shadow-[0_18px_55px_rgba(15,23,42,0.10)]"
          : "shadow-[0_35px_120px_rgba(0,0,0,0.38)]"
      }
      transition-shadow duration-300
      min-w-0
      h-auto
      xl:h-full
      xl:max-h-[340px]
    `}
    >
      <div className="flex flex-col xl:flex-row xl:h-full gap-4 sm:gap-5 items-center">
        <div className="w-full max-w-[360px] lg:max-w-[340px] lg:w-[340px] flex-shrink-0">
          {!featuredCard ? (
            <div className="min-h-[300px] lg:h-full flex flex-col items-center justify-center text-center">
              <div
                className={`
                w-14 h-14 rounded-2xl
                ${theme.surface}
                border ${theme.border}
                flex items-center justify-center mb-4
              `}
              >
                <span className="text-2xl">💳</span>
              </div>

              <p className={`${theme.textPrimary} font-medium`}>
                Nenhum cartão utilizado
              </p>

              <p className={`text-xs ${theme.textMuted} mt-1 max-w-[220px]`}>
                Seus cartões mais usados aparecerão aqui automaticamente.
              </p>
            </div>
          ) : (
            (() => {
              const bank = getBank(featuredCard.banco);

              const glowMap = {
                nubank: "bg-purple-500/30",
                inter: "bg-orange-400/30",
                itau: "bg-orange-500/30",
                santander: "bg-red-500/30",
                bradesco: "bg-red-600/30",
                bb: "bg-yellow-400/30",
                caixa: "bg-blue-500/30",
                sicoob: "bg-green-500/30",
                c6: "bg-white/20",
                original: "bg-gray-400/20",
                alelo: "bg-emerald-400/30",
                default: "bg-white/10",
              };

              const shadowMap = {
                nubank: "hover:shadow-[0_30px_90px_rgba(168,85,247,0.18)]",
                inter: "hover:shadow-[0_30px_90px_rgba(251,146,60,0.18)]",
                itau: "hover:shadow-[0_30px_90px_rgba(249,115,22,0.18)]",
                santander: "hover:shadow-[0_30px_90px_rgba(239,68,68,0.18)]",
                bradesco: "hover:shadow-[0_30px_90px_rgba(220,38,38,0.18)]",
                bb: "hover:shadow-[0_30px_90px_rgba(250,204,21,0.16)]",
                caixa: "hover:shadow-[0_30px_90px_rgba(59,130,246,0.18)]",
                sicoob: "hover:shadow-[0_30px_90px_rgba(34,197,94,0.18)]",
                c6: "hover:shadow-[0_30px_90px_rgba(255,255,255,0.10)]",
                alelo: "hover:shadow-[0_30px_90px_rgba(16,185,129,0.18)]",
                default: "hover:shadow-[0_30px_90px_rgba(255,255,255,0.10)]",
              };

              const hoverShadow = shadowMap[bank?.key] || shadowMap.default;

              const glowColor = glowMap[bank?.key] || glowMap.default;

              const total = transactions
                .filter((t) => String(t.cartaoId) === String(featuredCard.id))
                .reduce((acc, t) => acc + Number(t.valor || 0), 0);

              const limit =
                featuredCard.tipo === "vale"
                  ? Number(featuredCard.saldo || featuredCard.saldoInicial || 0)
                  : Number(featuredCard.limite || 0);

              const showProgress =
                ["credito", "multiplo", "vale"].includes(featuredCard.tipo) &&
                limit > 0;

              const percent = showProgress
                ? Math.min((total / limit) * 100, 100)
                : 0;

              return (
                <div className="relative group">
                  <div
                    className={`
                    absolute inset-[-8px] rounded-2xl blur-xl
                    ${
                     themeName === "light"
                       ? "opacity-20 group-hover:opacity-30"
                       : "opacity-35 group-hover:opacity-55"
                    }
                    scale-100 group-hover:scale-110
                    transition-all duration-300 ease-out
                    ${glowColor}
                  `}
                  />

                  <div className="relative z-10 transition-transform duration-300 group-hover:scale-[1.02]">
                    <Card3D
                      bank={bank}
                      featuredCard={featuredCard}
                      total={total}
                      limit={limit}
                      percent={percent}
                      showProgress={showProgress}
                      formatCurrency={formatCurrency}
                    />
                  </div>
                </div>
              );
            })()
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center w-full self-stretch">
          <p className={`text-[15px] font-medium ${theme.textSecondary}`}>
            Cartão principal
          </p>

          <div className="flex items-start justify-between mt-2 w-full gap-3">
            <div>
              <h2 className="text-[26px] sm:text-2xl font-bold leading-tight">
                {featuredCard?.nome || "Sem cartão"}
              </h2>

              <p className={`text-xs ${theme.textMuted} mt-1 capitalize`}>
                {featuredCard?.tipo === "multiplo"
                  ? "Crédito + Débito"
                  : featuredCard?.tipo || "—"}
              </p>
            </div>

            <span
              className={`
              text-[10px] px-2.5 py-1 rounded-full
              ${theme.accentSoft}
              ${theme.accentText}
              border ${theme.accentBorder}
              whitespace-nowrap
            `}
            >
              Principal
            </span>
          </div>

          {featuredCardStats && (
            <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div
                  className={`
                  ${theme.accentSoft}
                  border ${theme.accentBorder}
                  rounded-2xl p-2.5 sm:p-3
                `}
                >
                  <p
                    className={`text-[11px] uppercase tracking-[0.08em] ${theme.accentText}`}
                  >
                    Disponível
                  </p>

                  <p className="text-lg font-semibold text-emerald-300 mt-1 leading-none">
                    {formatCurrency(featuredCardStats.available)}
                  </p>
                </div>

                <div
                  className={`
                  ${theme.surface}
                  border ${theme.border}
                  rounded-2xl p-2.5 sm:p-3
                `}
                >
                  <p
                    className={`text-[11px] uppercase tracking-[0.08em] ${theme.textMuted}`}
                  >
                    Limite
                  </p>
                  <p className="text-lg font-semibold mt-1 leading-none">
                    {formatCurrency(featuredCardStats.limit)}
                  </p>
                </div>
              </div>

              <div
                className={`
                ${theme.surface}
                border ${theme.border}
                rounded-2xl p-2.5 sm:p-3 sm:mt-1
              `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`text-[11px] uppercase tracking-[0.08em] ${theme.textMuted}`}
                    >
                      Último uso
                    </p>

                    <p
                      className={`text-sm font-medium mt-2 truncate ${theme.textPrimary}`}
                    >
                      {featuredCardStats.lastUse?.descricao ||
                        "Sem uso recente"}
                    </p>
                  </div>

                  {featuredCardStats.lastUse?.data && (
                    <span
                      className={`
                      text-[10px] px-2 py-1 rounded-full
                      bg-white/[0.05]
                      ${theme.textMuted}
                      whitespace-nowrap
                    `}
                    >
                      {new Date(
                        featuredCardStats.lastUse.data,
                      ).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
