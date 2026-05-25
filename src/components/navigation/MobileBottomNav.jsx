import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

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
  return (
    <nav className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-5 right-5 z-50 md:hidden">
      <div className="relative h-[74px] bg-[#080D17]/95 border border-white/10 backdrop-blur-2xl rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.58)] flex items-center justify-around px-2">
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
                      className="absolute -top-[22px] w-[66px] h-[40px] rounded-full bg-emerald-400/20 blur-xl"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />

                    <motion.div
                      layoutId="nav-active-circle"
                      className="
    absolute
    -top-[18px]
    w-[58px]
    h-[58px]
    rounded-full
    bg-[#080D17]
    border-t
    border-white/30
    shadow-[0_14px_34px_rgba(0,0,0,0.5)]
  "
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
                    className={`w-[22px] h-[22px] transition-colors duration-300 ${
                      isActive ? "text-emerald-300" : "text-gray-500"
                    }`}
                  />
                </motion.div>

                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-[17px] text-[10px] font-normal leading-none text-emerald-300 tracking-[0.08em]"
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
