import { motion as Motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { useOnboarding } from "../contexts/OnboardingContext";
import AnimatedLogo from "../components/brand/AnimatedLogo";
import { useTheme } from "../theme/useTheme";

export default function Onboarding() {
  const navigate = useNavigate();
  const { theme, themeName } = useTheme();
  const { loading, finished, active, steps: completedSteps, saving, saveStatus } = useOnboarding();

  if (loading) return <div role="status" className="p-6 text-center">Carregando seus dados…</div>;
  if (finished) return <Navigate to="/dashboard" replace />;
  if (active) {
    const nextStep = Object.keys(completedSteps).find((path) => !completedSteps[path]);
    return <Navigate to={nextStep ?? "/dashboard"} replace />;
  }

  const steps = [
    "Criar sua primeira conta",
    "Organizar categorias",
    "Adicionar um cartão",
    "Registrar seu primeiro lançamento",
  ];

  return (
    <div
      className={`
        relative min-h-screen overflow-hidden
        flex items-center justify-center p-6
        ${themeName === "light" ? "bg-[#F8FAFC]" : "bg-[#050914]"}
        ${theme.textPrimary}
      `}
    >
      {/* glow */}
      <Motion.div
        animate={{
          opacity: [0.25, 0.55, 0.25],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          w-[520px]
          h-[520px]
          rounded-full
          bg-emerald-400/20
          blur-[120px]
        "
      />

      <Motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.96,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          relative z-10
          w-full max-w-[620px]
          rounded-[36px]
          border ${theme.border}
          ${themeName === "light" ? "bg-white/80" : "bg-[#111827]"}
          shadow-[0_24px_90px_rgba(0,0,0,0.35)]
          p-10
        `}
      >
        <div className="flex flex-col items-center text-center">
          <AnimatedLogo size="md" />

          <p className="mt-8 text-sm uppercase tracking-[0.25em] text-emerald-300">
            Bem-vinda ao Nivo
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            Vamos configurar seu espaço financeiro.
          </h1>

          <p className={`mt-4 max-w-[420px] ${theme.textSecondary}`}>
            Em poucos passos você terá seu ambiente pronto para acompanhar
            contas, cartões, orçamento e gastos em tempo real.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {steps.map((step, index) => (
            <Motion.div
              key={step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.25 + index * 0.08,
                duration: 0.5,
              }}
              className={`
                flex items-center gap-4
                rounded-3xl
                border ${theme.border}
                ${themeName === "light" ? "bg-slate-50" : "bg-white/[0.04]"}
                p-5
              `}
            >
              <div
                className="
                w-10 h-10 rounded-2xl
                bg-emerald-400/15
                text-emerald-300
                flex items-center justify-center
                font-semibold
              "
              >
                {index + 1}
              </div>

              <p className="text-lg font-medium">{step}</p>
            </Motion.div>
          ))}
        </div>

        <Motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={saving}
          onClick={async () => {
            if (await saveStatus("active")) navigate("/accounts");
          }}
          className="
        mt-10 w-full h-14 rounded-3xl
        bg-[#3EF2C2]
        text-black
        font-semibold text-lg cursor-pointer
        shadow-[0_18px_50px_rgba(62,242,194,0.18)]
    "
        >
          Criar primeira conta
        </Motion.button>
      </Motion.div>
    </div>
  );
}
