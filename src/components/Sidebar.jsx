import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import menu from "../navigation/menu";

export default function Sidebar() {
  return (
    <aside
      className="
        hidden md:flex
        m-4
        w-64
        h-[calc(100vh-2rem)]
        bg-[#0B0F1A]/70
        backdrop-blur-md
        border border-white/10
        rounded-2xl
        p-4
        flex-col
        z-50
      "
    >
      {/* LOGO */}
      <div className="mb-8 flex justify-center mt-5">
        <img src="/logo-principal-branca.svg" className="h-14" />
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.path} to={item.path} end>
              {({ isActive }) => (
                <div className="relative flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer">
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/10 rounded-xl pointer-events-none"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}

                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-full" />
                  )}

                  <Icon
                    className={`
                      w-5 h-5 relative z-10 transition-colors
                      ${isActive ? "text-white" : "text-gray-400"}
                    `}
                  />

                  <span className="text-sm relative z-10">{item.label}</span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 text-xs text-center text-gray-500">
        <p className="text-[16px] opacity-60">nivo ⬩ v1.2.0</p>
      </div>
    </aside>
  );
}
