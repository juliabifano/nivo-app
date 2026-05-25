import { motion } from "framer-motion";

export default function FloatingActionButton({
  open = false,
  onClick,
  className = "",
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      onClick={onClick}
      className={`
        fixed
        bottom-36
        right-5
        z-[70]
        lg:hidden
        w-14
        h-14
        rounded-2xl
        text-black
        text-2xl
        leading-none
        flex
        items-center
        justify-center
        transition-all
        duration-300
        ${
          open
            ? "bg-red-400 shadow-[0_14px_40px_rgba(248,113,113,0.35)]"
            : "bg-emerald-400 shadow-[0_14px_40px_rgba(16,185,129,0.35)]"
        }
        ${className}
      `}
    >
      <motion.span
        animate={{
          rotate: open ? 45 : 0,
          scale: open ? 0.92 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
        className="leading-none"
      >
        +
      </motion.span>
    </motion.button>
  );
}