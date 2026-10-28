import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../theme/useTheme";
import AnimatedLogo from "../components/brand/AnimatedLogo";

export default function Login() {
  const { login, register, isAuthenticated } = useAuth();
  const { theme, themeName } = useTheme();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.password || isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register(form);
        navigate("/onboarding");
      } else {
        await login(form);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = `
    w-full h-12 px-4 rounded-2xl
    border outline-none transition-all
    ${
      themeName === "light"
        ? "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-400"
        : "bg-[#0B1220] border-white/[0.08] text-white placeholder:text-white/35 focus:border-emerald-400/60"
    }
  `;

  return (
    <div
      className={`
      relative min-h-screen overflow-hidden
      ${themeName === "light" ? "bg-[#F8FAFC]" : "bg-[#050914]"}
      ${theme.textPrimary}
    `}
    >
      {/* BACKGROUND */}
      <motion.div
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-emerald-400/20 blur-[120px]"
      />

      <motion.div
        animate={{ opacity: [0.25, 0.55, 0.25], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-48 -right-40 w-[560px] h-[560px] rounded-full bg-purple-500/20 blur-[130px]"
      />

      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <section className="hidden lg:flex relative items-center justify-center p-12 overflow-hidden">
          <div className="max-w-[620px] w-full">
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-300 mb-5">
                Nivo Finance
              </p>

              <h1 className="text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight">
                Seu dinheiro no nível certo.
              </h1>

              <p
                className={`mt-5 text-base max-w-[460px] ${theme.textSecondary}`}
              >
                Acompanhe contas, cartões, orçamento e faturas em tempo real,
                com uma experiência simples, visual e inteligente.
              </p>
            </motion.div>

            {/* MOCKUP */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -1, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                relative rounded-[36px] border border-white/10
                bg-white/[0.055]
                shadow-[0_30px_120px_rgba(0,0,0,0.45)]
                overflow-hidden p-5
              "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-purple-500/10" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/45">Saldo atual</p>
                      <p className="text-3xl font-semibold text-emerald-300 mt-1">
                        R$ 4.250,00
                      </p>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs">
                      em tempo real
                    </div>
                  </div>

                  <div className="mt-8 h-32 rounded-3xl bg-[#0B1220]/70 border border-white/10 p-4 overflow-hidden">
                    <div className="flex items-end gap-2 h-full">
                      {[42, 64, 38, 78, 52, 90, 70, 96, 62].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 8 }}
                          animate={{ height: `${h}%` }}
                          transition={{
                            duration: 0.9,
                            delay: 0.4 + i * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="flex-1 rounded-full bg-emerald-400/80"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-4">
                      <p className="text-xs text-white/45">Fatura</p>
                      <p className="text-lg font-semibold mt-1">R$ 759,83</p>
                      <p className="text-xs text-emerald-300 mt-2">paga</p>
                    </div>

                    <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-4">
                      <p className="text-xs text-white/45">Agenda</p>
                      <p className="text-lg font-semibold mt-1">3 itens</p>
                      <p className="text-xs text-yellow-300 mt-2">acompanhar</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING CARD */}
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, 2, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                absolute -right-8 -top-8 w-[210px]
                rounded-[28px] border border-white/10
                bg-[#7412A8]/80 backdrop-blur-xl
                p-5 shadow-[0_20px_80px_rgba(116,18,168,0.35)]
              "
              >
                <p className="text-xs text-white/50 uppercase tracking-[0.18em]">
                  Nubank
                </p>
                <p className="text-xl font-semibold mt-2">Roxinho</p>
                <div className="h-1.5 rounded-full bg-white/10 mt-5 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "42%" }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                    className="h-full bg-emerald-300 rounded-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex items-center justify-center p-6 lg:p-12">
          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className={`
            w-full max-w-[430px]
            rounded-[34px]
            border ${theme.border}
            ${themeName === "light" ? "bg-white/80" : "bg-[#111827]"}
            p-8
            shadow-[0_24px_90px_rgba(0,0,0,0.35)]
          `}
          >
            {isSubmitting ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                className="
                min-h-[520px]
                flex flex-col
                items-center
                justify-center
                text-center
              "
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <AnimatedLogo size="md" />
                </motion.div>

                <motion.div
                  className="
                  mt-8
                  w-12 h-12
                  rounded-full
                  border-2
                  border-emerald-400/20
                  border-t-emerald-400
                "
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <p className={`mt-5 text-sm ${theme.textSecondary}`}>
                  Entrando no Nivo...
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-8 flex flex-col items-center text-center">
                  <AnimatedLogo size="md" />

                  <h2
                    className={`text-3xl font-semibold mt-6 ${theme.textPrimary}`}
                  >
                    {mode === "login" ? "Entrar no Nivo" : "Criar conta"}
                  </h2>

                  <p className={`text-sm mt-2 ${theme.textSecondary}`}>
                    {mode === "login"
                      ? "Continue para acessar suas finanças."
                      : "Crie sua conta para começar no Nivo."}
                  </p>
                </div>

                <div className="space-y-4">
                  {mode === "register" && (
                    <div>
                      <p className={`text-sm mb-2 ${theme.textSecondary}`}>
                        Nome
                      </p>
                      <input
                        value={form.name}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Seu nome"
                        className={inputClass}
                      />
                    </div>
                  )}

                  <div>
                    <p className={`text-sm mb-2 ${theme.textSecondary}`}>
                      Email
                    </p>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="voce@email.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <p className={`text-sm mb-2 ${theme.textSecondary}`}>
                      Senha
                    </p>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Sua senha"
                      className={inputClass}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="
                  w-full h-12 rounded-2xl mt-6
                  bg-[#3EF2C2]
                  text-black
                  font-semibold
                  shadow-[0_18px_50px_rgba(62,242,194,0.18)]
                  flex items-center justify-center
                "
                >
                  {mode === "login" ? "Entrar" : "Criar conta"}
                </motion.button>

                <button
                  type="button"
                  onClick={() =>
                    setMode((prev) => (prev === "login" ? "register" : "login"))
                  }
                  className={`w-full mt-4 text-sm ${theme.textSecondary}`}
                >
                  {mode === "login"
                    ? "Ainda não tenho conta"
                    : "Já tenho uma conta"}
                </button>
              </>
            )}
          </motion.form>
        </section>
      </div>
    </div>
  );
}
