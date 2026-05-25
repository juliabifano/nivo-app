import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ActionMenu({ actions = [], className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="
          w-6 h-6
          flex items-center justify-center
          text-white/70
          hover:text-white
          hover:scale-110
          active:scale-95
          transition-all
          duration-200
          text-xl
          leading-none
          cursor-pointer
        "
      >
        ⋮
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.16 }}
            className="
              absolute
              top-8
              right-0
              z-50
              min-w-[130px]
              rounded-2xl
              bg-[#0B0F1A]/90
              border border-white/10
              backdrop-blur-xl
              shadow-[0_18px_45px_rgba(0,0,0,0.35)]
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  setOpen(false);
                  action.onClick?.();
                }}
                className={`
                  w-full
                  px-3 py-2
                  text-left
                  text-xs
                  transition
                  ${
                    action.danger
                      ? "text-red-300 hover:bg-red-400/10"
                      : "text-white hover:bg-white/10"
                  }
                `}
              >
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
