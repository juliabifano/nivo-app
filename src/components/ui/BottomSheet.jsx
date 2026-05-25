import { motion, AnimatePresence } from "framer-motion";

export default function BottomSheet({
  open,
  onClose,
  children,
  className = "",
  style,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed inset-0
            z-50
            bg-black/60
            backdrop-blur-md
            flex items-end lg:items-center justify-center
          "
          onClick={onClose}
        >
          <motion.div
            initial={
              window.innerWidth >= 1024
                ? { opacity: 0, scale: 0.94, y: 20 }
                : { y: "100%", opacity: 0 }
            }
            animate={
              window.innerWidth >= 1024
                ? { opacity: 1, scale: 1, y: 0 }
                : { y: 0, opacity: 1 }
            }
            exit={
              window.innerWidth >= 1024
                ? { opacity: 0, scale: 0.94, y: 20 }
                : { y: "100%", opacity: 0 }
            }
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 260,
            }}
            drag={window.innerWidth < 1024 ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.18}
            onDragEnd={(event, info) => {
              if (info.offset.y > 120) {
                onClose?.();
              }
            }}
            whileDrag={{ scale: 0.985 }}
            style={style}
            onClick={(e) => e.stopPropagation()}
            className={`
    relative
    w-full
    h-[92vh]

    lg:w-[720px]
    lg:h-auto
    lg:max-h-[82vh]

    rounded-t-[32px]
    lg:rounded-[28px]

    overflow-y-auto
    overflow-x-hidden
    no-scrollbar

    bg-[#0B0F1A]
    border-t border-white/10

    ${className}
  `}
          >
            <div className="w-12 h-1 rounded-full bg-white/20 mx-auto mt-3 mb-5 lg:hidden" />

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
