import { motion as Motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/useTheme";
import { useOnboarding } from "../../contexts/OnboardingContext";

const steps = [
  { path: "/accounts", label: "Conta" },
  { path: "/categories", label: "Categorias" },
  { path: "/cards", label: "Cartão" },
  { path: "/transactions", label: "Lançamento" },
];

export default function OnboardingProgress() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { active: onboardingActive, steps: stepCompleted, saving, saveStatus } = useOnboarding();

  if (!onboardingActive) return null;

  const currentIndex = steps.findIndex((s) => s.path === location.pathname);

  if (currentIndex === -1) return null;

  const progress = (Object.values(stepCompleted).filter(Boolean).length / steps.length) * 100;

  const stepMessages = {
    "/accounts": {
      title: "Crie sua primeira conta",
      description: "Ela será usada para controlar seus saldos e movimentações.",
    },

    "/categories": {
      title: "Organize suas categorias",
      description:
        "Separe seus gastos e receitas para gerar análises melhores.",
    },

    "/cards": {
      title: "Adicione um cartão",
      description: "Controle limite, fatura e gastos em um só lugar.",
    },

    "/transactions": {
      title: "Primeira transação",
      description: "Registre uma movimentação para concluir sua configuração.",
    },
  };

  const successMessages = {
    "/accounts": {
      title: "✓ Conta criada com sucesso",
      description: "Agora vamos organizar suas categorias.",
    },

    "/categories": {
      title: "✓ Categorias configuradas",
      description: "Perfeito. Vamos adicionar seu primeiro cartão.",
    },

    "/cards": {
      title: "✓ Cartão configurado",
      description: "Agora registre sua primeira transação.",
    },

    "/transactions": {
      title: "✓ Primeira transação criada",
      description: "Tudo pronto para começar a usar o Nivo.",
    },
  };

  const currentMessage = stepCompleted[location.pathname]
    ? successMessages[location.pathname]
    : stepMessages[location.pathname];

  return (
    <div className="w-full flex justify-center">
      <Motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="
        relative overflow-hidden
        w-full max-w-[860px]
        rounded-[32px]
        p-6
        mb-8
        border border-white/[0.08]
        bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent
        shadow-[0_28px_90px_rgba(0,0,0,0.42)]
        backdrop-blur-xl
      "
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[460px] h-[220px] bg-emerald-400/10 blur-[110px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-center">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                {currentIndex + 1}
              </div>

              <div>
                <p
                  className={`text-xs uppercase tracking-[0.22em] ${theme.textMuted}`}
                >
                  Configuração inicial
                </p>

                <p className="text-sm text-emerald-400">
                  Passo {currentIndex + 1} de {steps.length}
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold">{currentMessage?.title}</h2>

            <p className={`mt-2 max-w-md text-sm ${theme.textSecondary}`}>
              {currentMessage?.description}
            </p>
          </div>

          <div className="lg:border-l lg:border-white/[0.08] lg:pl-6">
            <div className="flex justify-between mb-2">
              <span className={`text-sm ${theme.textSecondary}`}>
                Progresso
              </span>

              <span className="text-emerald-400 font-semibold">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
              <Motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-emerald-400 shadow-[0_0_25px_rgba(62,242,194,0.4)]"
              />
            </div>

            <div className="mt-6 space-y-3">
              {steps.map((step, index) => {
                const isCompleted = stepCompleted[step.path];
                const isCurrent = index === currentIndex;

                return (
                  <div
                    key={step.path}
                    className={`
          flex items-center gap-3
          rounded-2xl px-3 py-2
          transition-all
          ${isCurrent ? "bg-emerald-400/8 border border-emerald-400/15" : ""}
        `}
                  >
                    <div
                      className={`
            w-6 h-6 rounded-full
            flex items-center justify-center
            text-xs font-semibold
            ${
              isCompleted
                ? "bg-emerald-400 text-black"
                : isCurrent
                  ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/20"
                  : "bg-white/[0.06] text-gray-500"
            }
          `}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    <span
                      className={`
            text-sm
            ${
              isCompleted
                ? "text-emerald-400"
                : isCurrent
                  ? theme.textPrimary
                  : "text-gray-500"
            }
          `}
                    >
                      {step.label}
                    </span>

                    {isCurrent && (
                      <Motion.div
                        animate={{
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                        }}
                        className="ml-auto w-2 h-2 rounded-full bg-emerald-400"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              disabled={saving}
              onClick={async () => {
                if (await saveStatus("skipped")) navigate("/dashboard");
              }}
              className="mt-5 text-sm text-gray-400 hover:text-emerald-400 transition cursor-pointer"
            >
              Pular configuração →
            </button>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}
