import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import menu from "../navigation/menu";
import { useTheme } from "./../theme/useTheme";
import ProfileIcon from "./../assets/icons/Profile.svg?react";
import SettingsIcon from "./../assets/icons/Settings.svg?react";

export default function Sidebar() {
  const { theme, themeName } = useTheme();

  return (
    <aside
      className={`
        hidden md:flex
        m-4
        w-64
        h-[calc(100vh-2rem)]
        backdrop-blur-xl
        border
        rounded-2xl
        p-4
        flex-col
        z-50
        ${
          themeName === "light"
            ? "bg-slate-900/70 border-white/30 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            : "bg-[#0B0F1A]/70 border-white/10"
        }
      `}
    >
      <div className="mb-8 flex justify-center mt-5">
        <img src="/logo-principal-branca.svg" className="h-14" />
      </div>

      <nav className="flex flex-col gap-2 overflow-y-auto no-scrollbar pr-1">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.path} to={item.path} end>
              {({ isActive }) => (
                <div
                  className={`
                    relative flex items-center gap-3
                    px-3 py-2 rounded-xl
                    cursor-pointer transition-all
                    ${
                      isActive
                        ? "text-white"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
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
                      ${isActive ? "text-white" : "text-slate-400"}
                    `}
                  />

                  <span className="text-sm relative z-10">{item.label}</span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 space-y-2">
        {[
          { label: "Perfil", path: "/profile", Icon: ProfileIcon },
          { label: "Configurações", path: "/settings", Icon: SettingsIcon },
        ].map((item) => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => (
              <div
                className={`
            relative flex items-center gap-3
            px-3 py-2 rounded-xl
            cursor-pointer transition-all
            ${
              isActive
                ? "text-white"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }
          `}
              >
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

                <item.Icon
                  className={`
              w-5 h-5 relative z-10 transition-colors
              ${isActive ? "text-white" : "text-slate-400"}
            `}
                />

                <span className="text-sm relative z-10">{item.label}</span>
              </div>
            )}
          </NavLink>
        ))}

        <div className="pt-6 text-xs text-center text-slate-400">
          <p className="text-[16px] opacity-60">nivo ⬩ v1.3.0</p>
        </div>
      </div>
    </aside>
  );
}
