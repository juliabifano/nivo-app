import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#111827] text-white flex flex-col items-center justify-center px-6">
      {/* HERO */}
      <div className="text-center max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold leading-tight tracking-tight"
        >
          Controle total do seu dinheiro,
          <span className="text-emerald-400"> sem complicação</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mt-6 text-lg"
        >
          Visualize seus gastos, acompanhe seus cartões e entenda seu dinheiro
          de forma simples e inteligente.
        </motion.p>

        {/* BOTÃO CENTRAL */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <Link
            to="/dashboard"
            className="bg-emerald-400 text-black px-8 py-3 rounded-xl font-medium text-lg hover:bg-emerald-300 transition shadow-xl hover:scale-105 active:scale-95"
          >
            Começar
          </Link>
        </motion.div>
      </div>

      {/* MOCK APP (embaixo, mais sutil) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-20 w-full max-w-md relative"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <p className="text-sm text-gray-400">Saldo atual</p>
          <h3 className="text-2xl font-bold mt-1 text-emerald-400">
            R$ 4.250,00
          </h3>

          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Receitas</span>
              <span className="text-emerald-400">R$ 5.000</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Despesas</span>
              <span className="text-red-400">R$ 750</span>
            </div>
          </div>
        </div>

        {/* glow */}
        <div className="absolute -z-10 top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-400/20 blur-[120px]" />
      </motion.div>

      {/* FOOTER */}
      <div className="absolute bottom-6 text-gray-500 text-sm">
        © 2026 Nivo Finance
      </div>
    </div>
  );
}
