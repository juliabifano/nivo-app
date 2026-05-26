import HomeIcon from "../assets/icons/home.svg?react";
import BudgetIcon from "../assets/icons/budget.svg?react";
import CardIcon from "../assets/icons/card.svg?react";
import TransferIcon from "../assets/icons/transfer.svg?react";
import CalendarIcon from "../assets/icons/Calendar.svg?react";
import CardsIcon from "../assets/icons/cards.svg?react";
import NoteIcon from "../assets/icons/Note.svg?react";

export default [
  { label: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { label: "Orçamento Anual", path: "/annual", icon: BudgetIcon },
  { label: "Orçamento Mensal", path: "/monthly", icon: NoteIcon },
  { label: "Transações", path: "/transactions", icon: TransferIcon },
  { label: "Cartões", path: "/cards", icon: CardIcon },
  { label: "Contas", path: "/accounts", icon: CardsIcon },
  { label: "Agenda", path: "/schedule", icon: CalendarIcon },
];