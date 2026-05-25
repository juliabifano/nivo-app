import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./navigation/MobileBottomNav";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="relative flex h-dvh w-full overflow-hidden text-white bg-gradient-to-br from-[#0B0F1A] via-[#0F172A] to-[#020617]">
      <div className="pointer-events-none absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#FF7A6B]/10 blur-[120px] rounded-full" />

      <Sidebar />

      <main className="flex-1 min-w-0 h-full relative overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={location.pathname}
            className="h-full w-full"
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
