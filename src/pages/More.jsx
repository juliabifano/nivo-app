import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../theme/useTheme";

import BudgetIcon from "../assets/icons/budget.svg?react";
import NoteIcon from "../assets/icons/Note.svg?react";
import CalendarIcon from "../assets/icons/Calendar.svg?react";

const groups = [
  {
    title: "Planejamento",
    items: [
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
    ],
  },
  {
    title: "Conta",
    items: [
      {
        title: "Perfil",
        description: "Seus dados e preferências pessoais",
        path: "/profile",
        Icon: NoteIcon,
      },
      {
        title: "Configurações",
        description: "Tema, moeda, notificações e segurança",
        path: "/settings",
        Icon: BudgetIcon,
      },
    ],
  },
  {
    title: "Dados",
    items: [
      {
        title: "Exportar dados",
        description: "Backup local das informações do app",
        path: "/settings/data",
        Icon: CalendarIcon,
      },
    ],
  },
];

export default function More() {
  const { theme, themeName } = useTheme();

  return (
    <div className={`px-5 pt-8 pb-[120px] md:pb-10 ${theme.textPrimary}`}>
      <div className="max-w-[540px] mx-auto">
        <div className="mb-8">
          <p
            className={`text-sm ${theme.accentText} tracking-[0.18em] uppercase`}
          >
            Nivo
          </p>

          <h1 className="text-3xl font-semibold mt-2">Mais</h1>

          <p className={`text-sm mt-2 ${theme.textSecondary}`}>
            Acesse planejamento, perfil e configurações do app.
          </p>
        </div>

        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.title}>
              <h2
                className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-[0.18em] mb-3`}
              >
                {group.title}
              </h2>

              <div
                className={`
                  ${theme.surface}
                  border ${theme.border}
                  rounded-[28px]
                  overflow-hidden
                  backdrop-blur-xl
                `}
              >
                {group.items.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link to={item.path}>
                      <div
                        className={`
                          flex items-center gap-4 p-5
                          active:scale-[0.98]
                          transition-all
                          ${theme.surfaceHover}
                        `}
                      >
                        <div
                          className={`
                            w-12 h-12 rounded-2xl
                            ${theme.accentSoft}
                            border ${theme.accentBorder}
                            flex items-center justify-center shrink-0
                          `}
                        >
                          <item.Icon
                            className={`w-5 h-5 ${theme.accentText}`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-sm font-semibold ${theme.textPrimary}`}
                          >
                            {item.title}
                          </h3>

                          <p className={`text-xs mt-1 ${theme.textSecondary}`}>
                            {item.description}
                          </p>
                        </div>

                        <div className={`text-xl ${theme.textMuted}`}>→</div>
                      </div>
                    </Link>

                    {index < group.items.length - 1 && (
                      <div
                        className={`h-px ml-[84px] ${
                          themeName === "light"
                            ? "bg-slate-200/50"
                            : "bg-white/[0.06]"
                        }`}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
