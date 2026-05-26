import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./navigation/MobileBottomNav";
import { useTheme } from "../theme/useTheme";

export default function Layout() {
  const location = useLocation();
  const { theme, themeName } = useTheme();

  return (
    <div
      className={`relative flex h-dvh w-full overflow-hidden ${theme.textPrimary} ${theme.appBg}`}
    >
      <div
        className={`
    pointer-events-none absolute top-[-200px] left-[-200px]
    w-[500px] h-[500px] blur-[120px] rounded-full
   ${themeName === "light" ? "bg-emerald-200/18" : "bg-[#FF7A6B]/10"}
  `}
      />

      <div
        className={`
    pointer-events-none absolute bottom-[-200px] right-[-200px]
    w-[500px] h-[500px] blur-[120px] rounded-full
    ${themeName === "light" ? "bg-cyan-200/16" : "bg-[#FF7A6B]/10"}
  `}
      />

      <Sidebar />

      <main className="flex-1 min-w-0 h-full relative overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={location.pathname}
            className="h-full min-h-0 w-full overflow-hidden"
            initial={{ opacity: 0.96 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.98 }}
            transition={{
              duration: 0.08,
              ease: "linear",
            }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <MobileBottomNav />
    </div>
  );
}
