import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import BudgetIcon from "../assets/icons/budget.svg?react";
import NoteIcon from "../assets/icons/Note.svg?react";
import CalendarIcon from "../assets/icons/Calendar.svg?react";

const sections = [
  {
    title: "Orçamento Anual",
    description: "Planejamento financeiro do ano",
    path: "/annual",
    Icon: BudgetIcon,
  },
  {
    title: "Orçamento Mensal",
    description: "Resumo e controle mensal",
    path: "/monthly",
    Icon: NoteIcon,
  },
  {
    title: "Agenda",
    description: "Pagamentos e vencimentos",
    path: "/schedule",
    Icon: CalendarIcon,
  },
];

export default function More() {
  return (
    <div className="min-h-dvh overflow-y-auto px-5 pt-8 pb-32 text-white md:pb-10">
      <div className="max-w-[500px] mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm text-emerald-300 tracking-[0.18em] uppercase">
            Nivo
          </p>

          <h1 className="text-3xl font-semibold mt-2">
            Mais opções
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Acesse outras áreas do app.
          </p>
        </div>

        {/* GRID */}
        <div className="space-y-4">
          {sections.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.06,
              }}
            >
              <Link to={item.path}>
                <div
                  className="
                    bg-white/[0.04]
                    border border-white/[0.08]
                    rounded-[28px]
                    p-5
                    backdrop-blur-xl
                    active:scale-[0.98]
                    transition-all
                  "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-emerald-400/10
                        border border-emerald-400/10
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <item.Icon className="w-6 h-6 text-emerald-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-white">
                        {item.title}
                      </h2>

                      <p className="text-sm text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="text-gray-500 text-xl">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}