import { motion } from "framer-motion";

export default function GlassTabs({
  tabs = [],
  value,
  onChange,
  className = "",
}) {
  return (
    <div
      className={`
        relative
        flex
        items-center
        gap-2
        p-1
        rounded-2xl
        bg-white/[0.04]
        border border-white/[0.08]
        backdrop-blur-xl
        overflow-x-auto
        no-scrollbar
        ${className}
      `}
    >
      {tabs.map((tab) => {
        const active = value === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className="
              relative
              shrink-0
              flex-1
              px-4
              h-10
              rounded-xl
              text-sm
              whitespace-nowrap
              transition-all
              cursor-pointer
            "
          >
            {active && (
              <motion.div
                layoutId="glass-tab"
                className="
                  absolute
                  inset-0
                  rounded-xl
                  bg-white/[0.10]
                  border border-white/[0.08]
                  backdrop-blur-xl
                  shadow-[0_0_20px_rgba(255,255,255,0.06)]
                "
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}

            <span
              className={`
                relative
                z-10
                transition-colors
                ${
                  active
                    ? "text-white font-medium"
                    : "text-gray-300"
                }
              `}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}