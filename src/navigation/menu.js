import home from "../assets/icons/home.svg";
import budget from "../assets/icons/budget.svg";
import card from "../assets/icons/card.svg";
import transfer from "../assets/icons/transfer.svg";
import calendar from "../assets/icons/Calendar.svg";
import cards from "../assets/icons/cards.svg";

export default [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: home,
  },
  {
    label: "Orçamento Anual",
    path: "/annual",
    icon: budget,
  },
  {
    label: "Orçamento Mensal",
    path: "/monthly",
    icon: calendar,
  },
  {
    label: "Transações",
    path: "/transactions",
    icon: transfer,
  },
  {
    label: "Cartões",
    path: "/cards",
    icon: card,
  },
  {
    label: "Contas",
    path: "/accounts",
    icon: cards,
  },
];
