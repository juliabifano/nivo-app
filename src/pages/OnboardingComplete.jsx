import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "../components/brand/AnimatedLogo";
import { useTheme } from "../theme/useTheme";

export default function OnboardingComplete() {
  const navigate = useNavigate();
  const { theme, themeName } = useTheme();

  const completedSteps = [
    "Conta criada",
    "Categorias organizadas",
    "Cartão configurado",
    "Primeira transação registrada",
  ];

  function finishOnboarding() {
    localStorage.removeItem("nivo-onboarding-active");
    localStorage.setItem("nivo-onboarding-skipped", "true");

    navigate("/dashboard");
  }

  return (
    <div
      className={`
        relative min-h-screen overflow-hidden
        flex items-center justify-center p-6
        ${themeName === "light" ? "bg-[#F8FAFC]" : "bg-[#050914]"}
        ${theme.textPrimary}
      `}
    >
      <motion.div
        animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[560px] h-[560px] rounded-full bg-emerald-400/20 blur-[130px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`
          relative z-10
          w-full max-w-[620px]
          rounded-[38px]
          border ${theme.border}
          ${themeName === "light" ? "bg-white/80" : "bg-[#111827]"}
          shadow-[0_30px_110px_rgba(0,0,0,0.45)]
          p-10
          text-center
        `}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatedLogo size="md" />
        </motion.div>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="
            mx-auto mt-8
            w-16 h-16 rounded-[24px]
            bg-emerald-400
            text-black
            flex items-center justify-center
            text-3xl font-bold
            shadow-[0_18px_50px_rgba(62,242,194,0.28)]
          "
        >
          ✓
        </motion.div>

        <p className="mt-8 text-sm uppercase tracking-[0.25em] text-emerald-300">
          Configuração concluída
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          Tudo pronto para começar.
        </h1>

        <p className={`mt-4 ${theme.textSecondary}`}>
          Seu espaço financeiro foi configurado com sucesso.
        </p>

        <div className="mt-9 grid gap-3 text-left">
          {completedSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.08 }}
              className={`
                flex items-center gap-3
                rounded-2xl border
                px-4 py-3
                ${
                  themeName === "light"
                    ? "bg-slate-50 border-slate-200"
                    : "bg-white/[0.04] border-white/[0.08]"
                }
              `}
            >
              <span className="w-7 h-7 rounded-full bg-emerald-400 text-black flex items-center justify-center text-sm font-bold">
                ✓
              </span>

              <span className="font-medium">{step}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={finishOnboarding}
          className="
            mt-10 w-full h-14 rounded-3xl
            bg-[#3EF2C2]
            text-black
            font-semibold text-lg
            shadow-[0_18px_50px_rgba(62,242,194,0.18)]
          "
        >
          Entrar no Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}