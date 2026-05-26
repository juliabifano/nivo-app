import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../theme/useTheme";

import HomeIcon from "../../assets/icons/home.svg?react";
import TransferIcon from "../../assets/icons/transfer.svg?react";
import CardIcon from "../../assets/icons/card.svg?react";
import AccountsIcon from "../../assets/icons/cards.svg?react";
import MoreIcon from "../../assets/icons/Menu.svg?react";

const mobileItems = [
  { label: "Dashboard", path: "/dashboard", Icon: HomeIcon },
  { label: "Transações", path: "/transactions", Icon: TransferIcon },
  { label: "Cartões", path: "/cards", Icon: CardIcon },
  { label: "Contas", path: "/accounts", Icon: AccountsIcon },
  { label: "Mais", path: "/more", Icon: MoreIcon },
];

export default function MobileBottomNav() {
  const { theme, themeName } = useTheme();

  return (
    <nav className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-5 right-5 z-50 md:hidden pointer-events-none">
      <div className="relative h-[104px] pointer-events-auto">
        <div
          className={`
          absolute bottom-0 left-0 right-0 h-[74px]
          border backdrop-blur-2xl rounded-[28px]
          flex items-center justify-around px-2
          ${
            themeName === "light"
              ? "bg-white/92 border-slate-300/70 shadow-[0_22px_60px_rgba(15,23,42,0.24)]"
              : "bg-[#080D17]/95 border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.58)]"
          }
        `}
        >
          {mobileItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex-1 h-full flex items-center justify-center"
            >
              {({ isActive }) => (
                <div className="relative w-full h-full flex items-center justify-center">
                  {isActive && (
                    <>
                      <motion.div
                        layoutId="nav-active-glow"
                        className={`
                        absolute -top-[22px] w-[66px] h-[40px]
                        rounded-full blur-xl
                        ${
                          themeName === "light"
                            ? "bg-emerald-300/40"
                            : "bg-emerald-400/20"
                        }
                      `}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                      />

                      <motion.div
                        layoutId="nav-active-circle"
                        className={`
                        absolute -top-[18px]
                        w-[58px] h-[58px]
                        rounded-full
                        border-t
                        shadow-[0_14px_34px_rgba(0,0,0,0.18)]
                        ${
                          themeName === "light"
                            ? "bg-[#F8FAFC] border-slate-200 shadow-[0_14px_30px_rgba(15,23,42,0.16)]"
                            : "bg-[#080D17] border-white/30"
                        }
                      `}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                      />
                    </>
                  )}

                  <motion.div
                    animate={{
                      y: isActive ? -27 : -2,
                      scale: isActive ? 1.08 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 28,
                    }}
                    className="relative z-20 flex items-center justify-center"
                  >
                    <item.Icon
                      className={`
                      w-[22px] h-[22px] transition-colors duration-300
                      ${
                        isActive
                          ? theme.accentText
                          : themeName === "light"
                            ? "text-slate-400"
                            : "text-gray-500"
                      }
                    `}
                    />
                  </motion.div>

                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`
                      absolute bottom-[17px]
                      text-[10px] font-normal leading-none tracking-[0.08em]
                      ${theme.accentText}
                    `}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
