import { getBank } from "../../data/banks";
import Card3D from "../cards/Card3D";

export default function HeroCardSection({
  featuredCard,
  featuredCardStats,
  transactions,
  formatCurrency,
}) {
  return (
    <div className="col-span-6 bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-lg overflow-hidden">
      <div className="flex h-full gap-5 items-center">
        <div className="w-[380px] flex-shrink-0">
          {!featuredCard ? (
            <p className="text-gray-500 text-sm">
              Nenhum cartão usado.
            </p>
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

              const glowColor =
                glowMap[bank?.key] || glowMap.default;

              const total = transactions
                .filter(
                  (t) =>
                    String(t.cartaoId) ===
                    String(featuredCard.id),
                )
                .reduce(
                  (acc, t) =>
                    acc + Number(t.valor || 0),
                  0,
                );

              const limit =
                featuredCard.tipo === "vale"
                  ? Number(
                      featuredCard.saldo ||
                        featuredCard.saldoInicial ||
                        0,
                    )
                  : Number(featuredCard.limite || 0);

              const showProgress =
                ["credito", "multiplo", "vale"].includes(
                  featuredCard.tipo,
                ) && limit > 0;

              const percent = showProgress
                ? Math.min((total / limit) * 100, 100)
                : 0;

              return (
                <div className="relative group">
                  <div
                    className={`
                      absolute inset-[-8px] rounded-2xl blur-xl 
                      opacity-50 group-hover:opacity-80
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

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-sm text-gray-400">
            Cartão principal
          </p>

          <div className="flex items-center justify-between mt-1">
            <div>
              <h2 className="text-2xl font-bold">
                {featuredCard?.nome || "Sem cartão"}
              </h2>

              <p className="text-xs text-gray-400 mt-1 capitalize">
                {featuredCard?.tipo === "multiplo"
                  ? "Crédito + Débito"
                  : featuredCard?.tipo || "—"}
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300">
              Principal
            </span>
          </div>

          {featuredCardStats && (
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                  <p className="text-xs text-gray-400">
                    Disponível
                  </p>

                  <p className="font-semibold text-emerald-400 mt-1">
                    {formatCurrency(
                      featuredCardStats.available,
                    )}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                  <p className="text-xs text-gray-400">
                    Limite
                  </p>

                  <p className="font-semibold mt-1">
                    {formatCurrency(
                      featuredCardStats.limit,
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    Último uso
                  </p>

                  <p className="text-xs text-gray-500">
                    {featuredCardStats.lastUse?.data
                      ? new Date(
                          featuredCardStats.lastUse.data,
                        ).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "short",
                          },
                        )
                      : ""}
                  </p>
                </div>

                <p className="font-medium mt-1 truncate">
                  {featuredCardStats.lastUse
                    ?.descricao ||
                    "Sem uso recente"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}