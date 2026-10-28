import { motion } from "framer-motion";
import { useTheme } from "../../theme/useTheme";

export default function AnimatedLogo({ size = "md" }) {
  const { themeName } = useTheme();

  const logoSrc =
    themeName === "light"
      ? "/logo-principal-preta.svg"
      : "/logo-principal-branca.svg";

  const sizes = {
    sm: "w-[120px]",
    md: "w-[180px]",
    lg: "w-[240px]",
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.94,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex items-center justify-center"
    >
      {/* glow */}
      <motion.div
        animate={{
          opacity: [0.2, 0.45, 0.2],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          w-[220px]
          h-[220px]
          rounded-full
          bg-emerald-400/20
          blur-3xl
        "
      />

      {/* logo */}
      <motion.img
        src={logoSrc}
        alt="Nivo"
        className={`relative z-10 object-contain ${sizes[size]}`}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}