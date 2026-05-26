import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import { useTheme } from "../theme/useTheme";

export default function Profile() {
  const { theme, themeName } = useTheme();

  return (
    <div
      className={`
        h-full overflow-hidden
        px-4 pt-5 pb-28 lg:p-6
        flex justify-center
        ${theme.textPrimary}
      `}
    >
      <div className="w-full max-w-3xl h-full min-h-0 flex flex-col gap-6 overflow-hidden">
        <div className="shrink-0">
          <SectionHeader
            title="Perfil"
            subtitle="Sua conta e preferências"
            icon={
              <img
                src={
                  themeName === "light"
                    ? "/logo-ni-preta.svg"
                    : "/logo-ni-branca.svg"
                }
                className="w-6 h-6 object-contain"
              />
            }
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar pb-40 lg:pb-8 flex flex-col gap-7">
          {/* HERO */}
          <Card
            className="relative overflow-visible p-5 sm:p-6 shrink-0"
            variant="glass"
            hover="subtle"
          >
            <div className="absolute top-0 right-0 w-52 h-52 bg-emerald-400/10 blur-3xl rounded-full" />

            <div className="relative z-10 flex items-center gap-4">
              <label
                className="
                  group
                  relative
                  w-16 h-16 sm:w-20 sm:h-20
                  rounded-[24px] sm:rounded-[28px]
                  bg-gradient-to-br from-emerald-400 to-cyan-400
                  flex items-center justify-center
                  text-black text-2xl font-bold
                  shadow-[0_18px_50px_rgba(16,185,129,0.25)]
                  cursor-pointer
                  shrink-0
                  overflow-hidden
                "
              >
                <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-20">
                  J
                </span>

                <input type="file" accept="image/*" className="hidden" />

                <span
                  className="
                    absolute inset-0
                    flex items-center justify-center
                    bg-white/35
                    backdrop-blur-md
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-300
                  "
                >
                  <span
                    className="
                      w-9 h-9 rounded-full
                      bg-white/80
                      text-slate-700
                      text-xl
                      flex items-center justify-center
                      shadow-lg
                      border border-white/70
                    "
                  >
                    +
                  </span>
                </span>
              </label>

              <div className="min-w-0">
                <p className={`text-sm ${theme.textSecondary}`}>
                  Conta principal
                </p>

                <h1 className="text-2xl font-semibold mt-1">Júlia Bifano</h1>

                <p className={`text-sm mt-2 ${theme.textSecondary}`}>
                  Organizando suas finanças no nível certo.
                </p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <div className="px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/15 text-emerald-400 text-xs">
                    Plano Free
                  </div>

                  <div
                    className={`
                      px-3 py-1 rounded-full text-xs border
                      ${
                        themeName === "light"
                          ? "bg-white/70 border-slate-200/70 text-slate-600"
                          : "bg-white/[0.05] border-white/[0.08] text-gray-300"
                      }
                    `}
                  >
                    Tema dinâmico
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* RESUMO */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            {[
              {
                label: "Contas",
                value: "4",
              },
              {
                label: "Cartões",
                value: "3",
              },
              {
                label: "Transações",
                value: "128",
              },
              {
                label: "Categorias",
                value: "12",
              },
            ].map((item) => (
              <Card
                key={item.label}
                className="p-4"
                variant="glass"
                hover="subtle"
              >
                <p className={`text-xs ${theme.textSecondary}`}>{item.label}</p>

                <p className="text-2xl font-semibold mt-2">{item.value}</p>
              </Card>
            ))}
          </div>

          {/* PREFERÊNCIAS */}
          <Card
            className="p-5 shrink-0 overflow-visible min-h-[92px]"
            variant="glass"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-lg">Aparência</h2>

                <p className={`text-sm mt-1 ${theme.textSecondary}`}>
                  Personalize a aparência do aplicativo.
                </p>
              </div>

              <div
                className={`
                  px-3 py-1 rounded-full text-xs border shrink-0
                  ${
                    themeName === "light"
                      ? "bg-white/70 border-slate-200/70 text-slate-600"
                      : "bg-white/[0.05] border-white/[0.08] text-gray-300"
                  }
                `}
              >
                {themeName === "light" ? "Claro" : "Escuro"}
              </div>
            </div>
          </Card>

          {/* SEGURANÇA */}
          <Card className="p-5 shrink-0 overflow-visible" variant="glass">
            <h2 className="font-semibold text-lg">Segurança</h2>

            <div className="flex flex-col gap-3 mt-4">
              {[
                "Alterar senha",
                "Autenticação biométrica",
                "Sessões conectadas",
              ].map((item) => (
                <button
                  key={item}
                  className={`
                    h-12 rounded-2xl px-4
                    flex items-center justify-between
                    transition-all border
                    ${
                      themeName === "light"
                        ? "bg-white/70 border-slate-200/70 hover:bg-white"
                        : "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07]"
                    }
                  `}
                >
                  <span>{item}</span>

                  <span className={theme.textMuted}>›</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
