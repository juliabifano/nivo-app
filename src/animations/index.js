// 🔹 Durações padrão
export const duration = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
};

// 🔹 Curvas de animação
export const easing = {
  default: [0.4, 0, 0.2, 1],
  smooth: [0.25, 0.8, 0.25, 1],
  snappy: [0.4, 0, 0.6, 1],
};

// 🔹 Transições prontas
export const transitions = {
  fast: {
    duration: duration.fast,
    ease: easing.default,
  },
  normal: {
    duration: duration.normal,
    ease: easing.default,
  },
  smooth: {
    duration: duration.normal,
    ease: easing.smooth,
  },
  slow: {
    duration: duration.slow,
    ease: easing.smooth,
  },
};

// 🔹 Fade simples
export const fade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: transitions.normal,
  },
};

// 🔹 Fade + leve subida
export const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: transitions.normal, 
  },
};

// 🔹 Container com stagger
export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      ...transitions.fast, 
    },
  },
};

// 🔹 Item dentro de lista
export const listItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: transitions.fast, 
  },
};

// 🔹 Slide horizontal (fatura / troca de mês)
export const slideHorizontal = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: transitions.normal, 
  },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    transition: transitions.fast, 
  }),
};

// 🔹 Animação de grupo
export const groupFade = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: transitions.normal, 
  },
};